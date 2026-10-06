import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .startsWith("file:./", {
        error: "DATABASE_URL must start with file:./",
      })
      .min(1, { error: "DATABASE_URL is required" }),
    GMAIL_USER: z.email({ error: "GMAIL_USER email require" }),
    GMAIL_APP_PASSWORD: z
      .string()
      .min(1, { error: "GMAIL_APP_PASSWORD require" }),
    NEXT_TELEMETRY_DISABLED: z.enum(["1", "0"]).optional(),
    CHECKPOINT_DISABLE: z.enum(["1", "0"]).optional(),
    GOOGLE_SCRIPT_URL: z
      .string()
      .startsWith("https://script.google.com", {
        error: "GOOGLE_SCRIPT_URL must start with https://script.google.com",
      })
      .min(1, { error: "GOOGLE_SCRIPT_URL is required" }),
    GOOGLE_SCRIPT_URL_READ: z
      .string()
      .startsWith("https://script.google.com", {
        error: "GOOGLE_SCRIPT_URL must start with https://script.google.com",
      })
      .min(1, { error: "GOOGLE_SCRIPT_URL is required" }),
  },
  experimental__runtimeEnv: process.env,
});
