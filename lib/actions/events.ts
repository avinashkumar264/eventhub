"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/authorize";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validation/event";

export interface EventActionState {
  error?: string;
}

function toDecimalInput(value: number | undefined) {
  return value === undefined ? null : value;
}

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const session = await requireRole(["CUSTOMER"]);

  const parsed = eventSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  let eventId: string;
  try {
    const event = await prisma.event.create({
      data: {
        customerId: session.sub, // from the authenticated session — never from the form
        title: data.title,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        city: data.city || null,
        venueType: data.venueType || null,
        guestCount: data.guestCount ?? null,
        budgetMin: toDecimalInput(data.budgetMin),
        budgetMax: toDecimalInput(data.budgetMax),
        description: data.description || null,
        requirements: data.requirements || null,
      },
      select: { id: true },
    });
    eventId = event.id;
  } catch (err) {
    console.error("Create event error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/customer");
  revalidatePath("/customer/events");
  redirect(`/customer/events/${eventId}`);
}

export async function updateEvent(
  eventId: string,
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const session = await requireRole(["CUSTOMER"]);

  const parsed = eventSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  try {
    // updateMany + ownership in the WHERE clause: an id for another
    // customer's event simply matches zero rows, never leaks or edits it.
    const result = await prisma.event.updateMany({
      where: { id: eventId, customerId: session.sub },
      data: {
        title: data.title,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        city: data.city || null,
        venueType: data.venueType || null,
        guestCount: data.guestCount ?? null,
        budgetMin: toDecimalInput(data.budgetMin),
        budgetMax: toDecimalInput(data.budgetMax),
        description: data.description || null,
        requirements: data.requirements || null,
      },
    });

    if (result.count === 0) {
      return { error: "Event not found." };
    }
  } catch (err) {
    console.error("Update event error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/customer");
  revalidatePath("/customer/events");
  revalidatePath(`/customer/events/${eventId}`);
  redirect(`/customer/events/${eventId}`);
}
