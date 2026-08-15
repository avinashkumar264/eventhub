import { z } from "zod";

// Public registration may only ever create these roles.
// OPERATIONS and ADMIN are intentionally excluded here — never trust a
// client-supplied role for those, even if the request body includes one.
export const PUBLIC_ROLES = ["CUSTOMER", "VENDOR", "FREELANCER"] as const;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  role: z.enum(PUBLIC_ROLES, {
    error: "Select a valid account type",
  }),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
