import { z } from "zod";
import type { IFormField } from "../types/IFormField.types";

export const FeedBackSchema = z.object({
    name: z.string().min(2).max(32),
    email: z.string().email().max(64),
    message: z.string().min(15).max(512)
});

export const FeedBackMeta: Record<string, IFormField> = {
    name: {
        type: 'text',
        label: 'Your name:',
        placeholder: 'Enter your name'
    },
    email: {
        type: 'email',
        placeholder: 'Enter your e-mail',
        label: 'E-mail:'
    },
    message: {
        type: 'textarea',
        placeholder: '',
        label: 'Your message:'
    }
}

export type FeedBackFormData = z.infer<typeof FeedBackSchema>;