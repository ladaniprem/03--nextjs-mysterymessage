import {z} from 'zod';



export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, { error: "content must be at least of 10 characters" })
    .max(300, { error: "content must be at most of 300 characters" })
    .trim()
})