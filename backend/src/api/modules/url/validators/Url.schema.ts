import { z } from "zod";

export const urlEncodeRequestSchema = z.object({
  url: z.string().min(1, { message: "url is required" }).url({ message: "Please enter a valid url" }),
});

export const urlDecodeRequestSchema = z.object({
  shortUrl: z.string().min(1, { message: "shortUrl is required" }).url({ message: "Please enter a valid url" }),
});

export type UrlEncodeRequestType = z.infer<typeof urlEncodeRequestSchema>;
export type UrlDecodeRequestType = z.infer<typeof urlDecodeRequestSchema>;
