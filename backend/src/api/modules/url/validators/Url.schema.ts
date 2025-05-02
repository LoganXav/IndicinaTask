import { z } from "zod";

export const urlEncodeRequestSchema = z.object({
  url: z.string().min(1, { message: "url is required" }).max(2048, { message: "url is too long - maximum 2048 characters allowed" }).url({ message: "Please enter a valid url starting with http:// or https://" }),
});

export type UrlEncodeRequestType = z.infer<typeof urlEncodeRequestSchema>;
