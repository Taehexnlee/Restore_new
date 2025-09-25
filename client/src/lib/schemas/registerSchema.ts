// src/lib/schemas/registerSchema.ts
import { z } from "zod";

// Mirror Microsoft-style complexity requirements (lower/upper/digit/symbol, length 6-10)
const passwordValidation = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,10}$/
);

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .regex(
      passwordValidation,
      "Password must include 1 lowercase, 1 uppercase, 1 number, 1 special and be 6–10 chars"
    ),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
