import { z } from "zod";

export const SignUpSchema = z
    .string()
    .min(2,"username must be at least 2 characters")
    .max(20, "username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores")
    

    export const signUpSchema = z.object({
        username : SignUpSchema,
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "password must be at least 6 characters")
            .max(50, "password must be at most 50 characters")
            .regex(/[a-z]/, "password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "password must contain at least one uppercase letter")
            .regex(/[0-9]/, "password must contain at least one number")
            .regex(/[\W_]/, "password must contain at least one special character"),
    })