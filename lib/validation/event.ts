import { z } from "zod";

export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Anniversary",
  "Corporate",
  "Party",
  "Mehendi",
  "Other",
] as const;

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const eventSchema = z
  .object({
    title: z.string().trim().min(2, "Title is too short").max(120),
    eventType: z.enum(EVENT_TYPES, { error: "Select a valid event type" }),
    eventDate: z
      .string()
      .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
    startTime: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || timePattern.test(v),
        "Enter a valid start time (HH:mm)"
      ),
    endTime: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || timePattern.test(v),
        "Enter a valid end time (HH:mm)"
      ),
    guestCount: z.coerce
      .number()
      .int("Guest count must be a whole number")
      .positive("Guest count must be greater than zero")
      .max(100000, "Guest count is unreasonably large")
      .optional(),
    city: z.string().trim().max(120).optional(),
    venueType: z.string().trim().max(120).optional(),
    budgetMin: z.coerce
      .number()
      .nonnegative("Budget can't be negative")
      .optional(),
    budgetMax: z.coerce
      .number()
      .nonnegative("Budget can't be negative")
      .optional(),
    description: z.string().trim().max(4000).optional(),
    requirements: z.string().trim().max(4000).optional(),
  })
  .refine(
    (data) =>
      data.budgetMin === undefined ||
      data.budgetMax === undefined ||
      data.budgetMin <= data.budgetMax,
    { error: "Minimum budget can't be greater than maximum budget", path: ["budgetMax"] }
  )
  .refine(
    (data) =>
      !data.startTime || !data.endTime || data.startTime < data.endTime,
    { error: "End time must be after start time", path: ["endTime"] }
  );

export type EventInput = z.infer<typeof eventSchema>;
