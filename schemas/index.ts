import { z } from "zod";

export const LoginSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Email is invalid"),
    password: z
        .string()
        .min(1, { message: "Password is required"}),
});
