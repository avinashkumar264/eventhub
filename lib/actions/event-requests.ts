"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { eventRequestSchema } from "@/lib/validation/event-request";

export interface EventRequestActionState {
  error?: string;
  success?: boolean;
}

export async function createEventRequest(
  eventId: string,
  _prevState: EventRequestActionState,
  formData: FormData
): Promise<EventRequestActionState> {
  const session = await requireRole(["CUSTOMER"]);

  const parsed = eventRequestSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { category, description } = parsed.data;

  try {
    // Ownership check: the event must belong to this session's customer.
    // Never trust an eventId/customerId pairing from the client alone —
    // this lookup is what actually enforces it.
    const event = await prisma.event.findFirst({
      where: { id: eventId, customerId: session.sub },
      select: { id: true },
    });

    if (!event) {
      return { error: "Event not found." };
    }

    const existing = await prisma.eventRequest.findFirst({
      where: { eventId: event.id, category, status: { not: "CANCELLED" } },
      select: { id: true },
    });
    if (existing) {
      return {
        error: `A ${category} request already exists for this event.`,
      };
    }

    const request = await prisma.eventRequest.create({
      data: {
        eventId: event.id,
        customerId: session.sub,
        category,
        description: description || null,
      },
      select: { id: true },
    });

    // Eligible providers = any provider with an active service in this
    // category. This is the whole Day 5 matching rule — no subscription
    // gating or scoring today; every eligible provider gets the lead.
    const eligibleProviders = await prisma.provider.findMany({
      where: {
        services: {
          some: { category: { equals: category, mode: "insensitive" }, active: true },
        },
      },
      select: { id: true },
    });

    if (eligibleProviders.length > 0) {
      await prisma.lead.createMany({
        data: eligibleProviders.map((provider) => ({
          eventRequestId: request.id,
          providerId: provider.id,
        })),
        skipDuplicates: true,
      });
    }
  } catch (err) {
    console.error("Create event request error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/customer/events/${eventId}`);
  return { success: true };
}
