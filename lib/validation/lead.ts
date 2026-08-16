import { z } from "zod";

// CONVERTED intentionally excluded — it belongs to the quotation/booking
// flow, which is a future day. Providers can only manage pre-quotation
// status today.
export const MANAGEABLE_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
] as const;

export const leadStatusSchema = z.object({
  status: z.enum(MANAGEABLE_LEAD_STATUSES, { error: "Select a valid status" }),
});
