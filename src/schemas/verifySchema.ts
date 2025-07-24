import {z} from 'zod';

export const VerifySchema = z.object({
     code : z.string()
        .min(6, "Verification code must be at least 6 characters")
        .max(6, "Verification code must be at most 6 characters")
        .regex(/^[0-9]+$/, "Verification code can only contain numbers"),
})