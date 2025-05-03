import { z } from 'zod';

export const UrlShortenerEncodeSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Invalid URL' }),
});

export const UrlShortenerDecodeSchema = z.object({
  shortUrl: z
    .string()
    .min(1, { message: 'Short URL is required' })
    .url({ message: 'Invalid Short URL' }),
});

export type UrlShortenerDecodeRequestType = z.infer<
  typeof UrlShortenerDecodeSchema
>;

export type UrlShortenerEncodeRequestType = z.infer<
  typeof UrlShortenerEncodeSchema
>;
