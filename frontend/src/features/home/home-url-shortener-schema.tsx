import { z } from 'zod';

export const UrlShortenerEncodeSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Invalid URL' }),
});

export type UrlShortenerEncodeRequestType = z.infer<
  typeof UrlShortenerEncodeSchema
>;
