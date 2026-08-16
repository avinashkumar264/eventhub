import { z } from "zod";

export const FREELANCER_SPECIALTIES = [
  "PHOTOGRAPHY",
  "MEHENDI",
  "DESIGNING",
  "MAKEUP",
  "FACIAL",
  "DECORATION",
  "CATERING",
  "OTHER",
] as const;

export const providerProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business/display name is required")
    .max(120),
  bio: z.string().trim().max(2000).optional(),
  city: z.string().trim().max(120).optional(),
  experienceYears: z.coerce
    .number()
    .int("Enter a whole number")
    .nonnegative("Can't be negative")
    .max(80, "Enter a realistic number of years")
    .optional(),
  freelancerSpecialty: z.enum(FREELANCER_SPECIALTIES).optional(),
});

export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;
