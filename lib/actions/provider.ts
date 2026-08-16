"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { providerProfileSchema } from "@/lib/validation/provider";
import { serviceSchema } from "@/lib/validation/service";

export interface ProviderActionState {
  error?: string;
  success?: boolean;
}

export async function saveProviderProfile(
  _prevState: ProviderActionState,
  formData: FormData
): Promise<ProviderActionState> {
  const session = await requireRole(["VENDOR", "FREELANCER"]);

  const parsed = providerProfileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  // Provider type is derived from the authenticated session's role —
  // never accepted from the client, so it can't be spoofed.
  const type = session.role === "VENDOR" ? "EVENT_COMPANY" : "FREELANCER";

  if (type === "FREELANCER" && !data.freelancerSpecialty) {
    return { error: "Select your specialty." };
  }

  try {
    await prisma.provider.upsert({
      where: { userId: session.sub },
      create: {
        userId: session.sub,
        type,
        businessName: data.businessName,
        bio: data.bio || null,
        city: data.city || null,
        experienceYears: data.experienceYears ?? null,
        freelancerSpecialty:
          type === "FREELANCER" ? data.freelancerSpecialty : null,
      },
      update: {
        businessName: data.businessName,
        bio: data.bio || null,
        city: data.city || null,
        experienceYears: data.experienceYears ?? null,
        freelancerSpecialty:
          type === "FREELANCER" ? data.freelancerSpecialty : null,
      },
    });
  } catch (err) {
    console.error("Save provider profile error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/vendor");
  revalidatePath("/vendor/profile");
  revalidatePath("/freelancer");
  revalidatePath("/freelancer/profile");
  return { success: true };
}

export async function createService(
  _prevState: ProviderActionState,
  formData: FormData
): Promise<ProviderActionState> {
  const session = await requireRole(["VENDOR", "FREELANCER"]);

  const parsed = serviceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  try {
    const provider = await prisma.provider.findUnique({
      where: { userId: session.sub },
      select: { id: true },
    });
    if (!provider) {
      return { error: "Complete your profile before adding services." };
    }

    await prisma.service.create({
      data: {
        providerId: provider.id,
        category: data.category,
        title: data.title,
        description: data.description || null,
        basePrice: data.basePrice ?? null,
      },
    });
  } catch (err) {
    console.error("Create service error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/vendor/profile");
  revalidatePath("/freelancer/profile");
  return { success: true };
}
