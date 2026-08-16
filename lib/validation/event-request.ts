import { z } from "zod";

export const EVENT_REQUEST_CATEGORIES = [
  "Photography",
  "Catering",
  "Decoration",
  "Mehendi",
  "Makeup",
  "Venue",
  "Other",
] as const;

export const eventRequestSchema = z.object({
  category: z.enum(EVENT_REQUEST_CATEGORIES, {
    error: "Select a valid service category",
  }),
  description: z.string().trim().max(2000).optional(),
});

export type EventRequestInput = z.infer<typeof eventRequestSchema>;
