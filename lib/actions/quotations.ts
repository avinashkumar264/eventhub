"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { quotationSchema, computeFinalAmount } from "@/lib/validation/quotation";

export interface QuotationActionState {
  error?: string;
}

export async function createQuotation(
  leadId: string,
  areaPath: "vendor" | "freelancer",
  _prevState: QuotationActionState,
  formData: FormData
): Promise<QuotationActionState> {
  const session = await requireRole(["VENDOR", "FREELANCER"]);

  const parsed = quotationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const provider = await prisma.provider.findUnique({
    where: { userId: session.sub },
    select: { id: true },
  });
  if (!provider) {
    return { error: "Complete your profile before quoting." };
  }

  // Authorization chain: authenticated user -> provider -> this lead
  // belongs to that provider -> eventRequestId comes from the lead itself,
  // never from client input.
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, providerId: provider.id },
    select: { id: true, eventRequestId: true },
  });
  if (!lead) {
    return { error: "Lead not found." };
  }

  const existingActive = await prisma.quotation.findFirst({
    where: { leadId: lead.id, status: "SUBMITTED" },
    select: { id: true },
  });
  if (existingActive) {
    return { error: "You already have an active quotation for this lead." };
  }

  const finalAmount = computeFinalAmount(data);
  let quotationId: string;

  try {
    const quotation = await prisma.quotation.create({
      data: {
        leadId: lead.id,
        eventRequestId: lead.eventRequestId,
        providerId: provider.id,
        title: data.title,
        description: data.description || null,
        baseAmount: data.baseAmount,
        additionalCharges: data.additionalCharges ?? 0,
        discount: data.discount ?? 0,
        tax: data.tax ?? 0,
        finalAmount,
        details: data.details || null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        status: "SUBMITTED",
      },
      select: { id: true },
    });
    quotationId = quotation.id;
  } catch (err) {
    console.error("Create quotation error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  void quotationId;
  revalidatePath(`/${areaPath}/leads/${leadId}`);
  redirect(`/${areaPath}/leads/${leadId}`);
}

export interface AcceptQuotationState {
  error?: string;
}

/**
 * Customer accepts a SUBMITTED quotation on one of their own event
 * requests. Ownership is enforced via eventRequest.customerId in the
 * WHERE clause — a quotation on another customer's request matches
 * zero rows and is never touched.
 */
export async function acceptQuotation(
  quotationId: string
): Promise<AcceptQuotationState> {
  const session = await requireRole(["CUSTOMER"]);

  const result = await prisma.quotation.updateMany({
    where: {
      id: quotationId,
      status: "SUBMITTED",
      eventRequest: { customerId: session.sub },
    },
    data: { status: "ACCEPTED" },
  });

  if (result.count === 0) {
    return {
      error:
        "This quotation can't be accepted (not found, not yours, or no longer submitted).",
    };
  }

  revalidatePath(`/customer/quotations/${quotationId}`);
  revalidatePath("/customer/quotations");
  return {};
}
