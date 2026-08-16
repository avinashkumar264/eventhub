import { z } from "zod";

export const SERVICE_CATEGORIES = [
  "Photography",
  "Videography",
  "Decoration",
  "Catering",
  "Mehendi",
  "Makeup",
  "Designing",
  "Facials",
  "Venue",
  "DJ / Music",
  "Other",
] as const;

export const serviceSchema = z.object({
  category: z.enum(SERVICE_CATEGORIES, { error: "Select a valid category" }),
  title: z.string().trim().min(2, "Title is too short").max(120),
  description: z.string().trim().max(2000).optional(),
  basePrice: z.coerce
    .number()
    .nonnegative("Price can't be negative")
    .optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
