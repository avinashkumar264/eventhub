import { z } from "zod";

export const quotationSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(120),
  description: z.string().trim().max(2000).optional(),
  baseAmount: z.coerce
    .number()
    .positive("Base amount must be greater than zero"),
  additionalCharges: z.coerce
    .number()
    .nonnegative("Can't be negative")
    .optional(),
  discount: z.coerce.number().nonnegative("Can't be negative").optional(),
  tax: z.coerce.number().nonnegative("Can't be negative").optional(),
  validUntil: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date"),
  details: z.string().trim().max(2000).optional(),
});

export type QuotationInput = z.infer<typeof quotationSchema>;

/** Server-side total — never trust a final amount sent from the browser. */
export function computeFinalAmount(input: {
  baseAmount: number;
  additionalCharges?: number;
  discount?: number;
  tax?: number;
}) {
  const total =
    input.baseAmount +
    (input.additionalCharges ?? 0) -
    (input.discount ?? 0) +
    (input.tax ?? 0);
  return Math.max(0, Math.round(total * 100) / 100);
}
