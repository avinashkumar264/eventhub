import { z } from "zod";

export const paymentAmountSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than zero"),
});
