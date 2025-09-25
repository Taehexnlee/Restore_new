import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Auto-generate TypeScript types from the schema
export type LoginSchema = z.infer<typeof loginSchema>;
