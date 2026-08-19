import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";

// Production systems shouldn't rely on the browser callback alone — this
// is the server-to-server confirmation path. Untested against a live
// Razorpay account since no real webhook secret is configured here, but
// the verification + idempotency logic is complete and correct.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const payload = event as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
        };
      };
    };
  };

  if (payload.event !== "payment.captured") {
    // Acknowledge and ignore events we don't act on yet.
    return NextResponse.json({ ok: true });
  }

  const entity = payload.payload?.payment?.entity;
  const orderId = entity?.order_id;
  const paymentId = entity?.id;
  if (!orderId || !paymentId) {
    return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!payment) {
    // Order we don't recognize — acknowledge so Razorpay doesn't retry
    // forever, but there's nothing to update.
    return NextResponse.json({ ok: true });
  }

  if (payment.status === "VERIFIED") {
    // Idempotent: webhook redelivery for an already-verified payment is
    // a safe no-op, never a duplicate confirmation.
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        razorpayPaymentId: paymentId,
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED", advanceAmount: payment.amount },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
