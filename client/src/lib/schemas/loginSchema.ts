import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// ✅ 스키마에서 TS 타입 자동 생성
export type LoginSchema = z.infer<typeof loginSchema>;