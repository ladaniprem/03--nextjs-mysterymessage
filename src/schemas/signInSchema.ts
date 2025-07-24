import {z} from 'zod';

export const signInSchema = z.object({
    identifier : z.string().length(0, "Identifier cannot be empty"),
    password : z.string()
        .min(6, "Password must be at least 6 characters")
})