// src/lib/schemas/registerSchema.ts
import { z } from "zod";

// MS 복잡도 규칙과 유사(소문자/대문자/숫자/특수문자 포함, 길이 6~10)
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