"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { paymentAmountSchema } from "@/lib/validation/payment";
import {
  createRazorpayOrder,
  getPublicRazorpayKeyId,
  verifyCheckoutSignature,
} from "@/lib/payments/razorpay";

export interface BookingActionState {
  error?: string;
}

/**
 * Creates a booking from an ACCEPTED quotation belonging to the
 * authenticated customer's own event request. Ownership + status are
 * both enforced in the same query — a quotation that isn't theirs, or
 * isn't ACCEPTED, matches nothing.
 */
export async function createBooking(
  quotationId: string
): Promise<BookingActionState> {
  const session = await requireRole(["CUSTOMER"]);

  const quotation = await prisma.quotation.findFirst({
    where: {
      id: quotationId,
      status: "ACCEPTED",
      eventRequest: { customerId: session.sub },
    },
    select: {
      id: true,
      providerId: true,
      finalAmount: true,
      eventRequest: { select: { eventId: true } },
    },
  });

  if (!quotation) {
    return {
      error:
        "This quotation isn't available for booking (not found, not yours, or not accepted).",
    };
  }

  let bookingId: string;
  try {
    const booking = await prisma.booking.create({
      data: {
        quotationId: quotation.id,
        eventId: quotation.eventRequest.eventId,
        customerId: session.sub,
        providerId: quotation.providerId,
        totalAmount: quotation.finalAmount, // commercial snapshot at booking time
      },
      select: { id: true },
    });
    bookingId = booking.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "A booking already exists for this quotation." };
    }
    console.error("Create booking error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/customer/bookings");
  redirect(`/customer/bookings/${bookingId}`);
}

export interface PaymentOrderResult {
  error?: string;
  orderId?: string;
  amount?: number;
  keyId?: string;
  paymentId?: string;
}

/**
 * Creates a Razorpay order for an advance payment on the customer's own
 * booking. Never fakes an order — if the payment provider isn't
 * configured, returns a clear error instead of fabricating one.
 */
export async function createPaymentOrder(
  bookingId: string,
  formData: FormData
): Promise<PaymentOrderResult> {
  const session = await requireRole(["CUSTOMER"]);

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: session.sub },
    select: { id: true, status: true, totalAmount: true },
  });
  if (!booking) return { error: "Booking not found." };
  if (booking.status === "CONFIRMED") {
    return { error: "This booking is already confirmed." };
  }

  const alreadyVerified = await prisma.payment.findFirst({
    where: { bookingId: booking.id, type: "ADVANCE", status: "VERIFIED" },
    select: { id: true },
  });
  if (alreadyVerified) {
    return { error: "Advance payment already verified for this booking." };
  }

  const parsed = paymentAmountSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid amount." };
  }
  const { amount } = parsed.data;

  if (amount > Number(booking.totalAmount)) {
    return { error: "Amount can't exceed the total booking amount." };
  }

  const keyId = getPublicRazorpayKeyId();
  const order = await createRazorpayOrder({
    amountInPaise: Math.round(amount * 100),
    receipt: booking.id,
  });

  if (!order || !keyId) {
    return {
      error:
        "Payment provider is not configured yet. Please contact EventHub Operations.",
    };
  }

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      payerId: session.sub,
      type: "ADVANCE",
      status: "PENDING",
      amount,
      razorpayOrderId: order.orderId,
    },
    select: { id: true },
  });

  return { orderId: order.orderId, amount, keyId, paymentId: payment.id };
}

export interface VerifyPaymentResult {
  ok?: boolean;
  error?: string;
}

/**
 * Verifies the signature Razorpay Checkout returns after payment and,
 * only if valid, marks the payment VERIFIED and confirms the booking.
 * Idempotent: if this payment is already VERIFIED, re-calling this is a
 * safe no-op rather than double-processing.
 */
export async function verifyPayment(
  bookingId: string,
  params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
): Promise<VerifyPaymentResult> {
  const session = await requireRole(["CUSTOMER"]);

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: session.sub },
    select: { id: true },
  });
  if (!booking) return { error: "Booking not found." };

  const payment = await prisma.payment.findFirst({
    where: {
      bookingId: booking.id,
      payerId: session.sub,
      razorpayOrderId: params.razorpay_order_id,
    },
  });
  if (!payment) return { error: "Payment record not found." };

  if (payment.status === "VERIFIED") {
    return { ok: true }; // already processed — idempotent no-op
  }

  const valid = verifyCheckoutSignature({
    orderId: params.razorpay_order_id,
    paymentId: params.razorpay_payment_id,
    signature: params.razorpay_signature,
  });

  if (!valid) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return { error: "Payment verification failed." };
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        razorpayPaymentId: params.razorpay_payment_id,
        razorpaySignature: params.razorpay_signature,
      },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED", advanceAmount: payment.amount },
    }),
  ]);

  revalidatePath(`/customer/bookings/${bookingId}`);
  return { ok: true };
}
