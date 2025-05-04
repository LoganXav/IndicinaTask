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

export const UrlStatisticSchema = z.object({
  path: z.string().min(1, { message: 'Shortened URL path is required' }),
});

export const UrlShortenerRedirectSchema = z.object({
  urlPath: z.string().min(1, { message: 'Shortened URL path is required' }),
});

export type UrlShortenerEncodeRequestType = z.infer<
  typeof UrlShortenerEncodeSchema
>;

export type UrlShortenerDecodeRequestType = z.infer<
  typeof UrlShortenerDecodeSchema
>;

export type UrlStatisticRequestType = z.infer<typeof UrlStatisticSchema>;

export type UrlShortenerRedirectRequestType = z.infer<
  typeof UrlShortenerRedirectSchema
>;
