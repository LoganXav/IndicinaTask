import { z } from "zod";
import AppSettings from "~/helpers/settings/AppSettings";

export const urlEncodeRequestSchema = z.object({
  url: z.string().min(1, { message: "url is required" }).url({ message: "Please enter a valid url" }),
});

export const urlDecodeRequestSchema = z.object({
  shortUrl: z.string().min(1, { message: "shortUrl is required" }).url({ message: "Please enter a valid url" }),
});

export const urlStatisticRequestSchema = z.object({
  path: z
    .string()
    .min(1, { message: "path is required" })
    .regex(new RegExp(`^[a-zA-Z0-9]{${AppSettings.UrlShortenerLength}}$`), { message: `invalid url path string` }),
});

export const urlRedirectRequestSchema = z.object({
  path: z
    .string()
    .min(1, { message: "path is required" })
    .regex(new RegExp(`^[a-zA-Z0-9]{${AppSettings.UrlShortenerLength}}$`), { message: `invalid url path string` }),
});

export type UrlEncodeRequestType = z.infer<typeof urlEncodeRequestSchema>;
export type UrlDecodeRequestType = z.infer<typeof urlDecodeRequestSchema>;
export type UrlRedirectRequestType = z.infer<typeof urlRedirectRequestSchema>;
export type UrlStatisticRequestType = z.infer<typeof urlStatisticRequestSchema>;
