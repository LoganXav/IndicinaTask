import { z } from 'zod';

export const UrlEncodeSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Invalid URL' }),
});

export type UrlEncodeRequestType = z.infer<typeof UrlEncodeSchema>;
