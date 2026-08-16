"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { leadStatusSchema } from "@/lib/validation/lead";

export interface LeadActionState {
  error?: string;
  success?: boolean;
}

async function getOwnedProviderId(userId: string) {
  const provider = await prisma.provider.findUnique({
    where: { userId },
    select: { id: true },
  });
  return provider?.id ?? null;
}

export async function markLeadViewed(leadId: string) {
  const session = await requireRole(["VENDOR", "FREELANCER"]);
  const providerId = await getOwnedProviderId(session.sub);
  if (!providerId) return;

  // Scoped by providerId in the WHERE clause — a lead belonging to
  // another provider simply matches zero rows here.
  await prisma.lead.updateMany({
    where: { id: leadId, providerId, viewedAt: null },
    data: { viewedAt: new Date() },
  });

  revalidatePath("/vendor/leads");
  revalidatePath("/freelancer/leads");
}

export async function updateLeadStatus(
  leadId: string,
  _prevState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const session = await requireRole(["VENDOR", "FREELANCER"]);
  const providerId = await getOwnedProviderId(session.sub);
  if (!providerId) {
    return { error: "Complete your profile first." };
  }

  const parsed = leadStatusSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid status." };
  }

  const result = await prisma.lead.updateMany({
    where: { id: leadId, providerId },
    data: { status: parsed.data.status, viewedAt: new Date() },
  });

  if (result.count === 0) {
    return { error: "Lead not found." };
  }

  revalidatePath(`/vendor/leads/${leadId}`);
  revalidatePath(`/freelancer/leads/${leadId}`);
  return { success: true };
}
