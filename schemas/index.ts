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

export const RegisterSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Email is invalid"),
    password: z
        .string()
        .min(6, { message: "Minimu 6 characters is required" }),
    name: z
        .string()
        .min(1, { message: "Name is required" }),
});
