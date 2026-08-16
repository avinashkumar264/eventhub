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

    await prisma.eventRequest.create({
      data: {
        eventId: event.id,
        customerId: session.sub,
        category,
        description: description || null,
      },
    });
  } catch (err) {
    console.error("Create event request error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/customer/events/${eventId}`);
  return { success: true };
}
