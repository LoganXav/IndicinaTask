import { z } from 'zod';

export const UrlShortenerSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('encode'),
    url: z
      .string()
      .min(1, { message: 'URL is required' })
      .url({ message: 'Invalid URL' }),
    shortUrl: z.string().optional(),
  }),
  z.object({
    action: z.literal('decode'),
    url: z.string().optional(),
    shortUrl: z
      .string()
      .min(1, { message: 'Short URL is required' })
      .url({ message: 'Invalid Short URL' }),
  }),
]);

export type UrlShortenerRequestType = z.infer<typeof UrlShortenerSchema>;
