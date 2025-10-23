import { z } from "zod"

const hostRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

/**
 * 
 * @example
 * "https://www.google.com" => incorrecto
 * "google.com" => correcto
 * "google" => incorrecto
 * "www.google.com.ar" => correcto
 */

const hostScheme = z.string()
    .transform((val) => val.trim().replaceAll("/", ""))
    .refine((val) => hostRegex.test(val), "Invalid host example: google.com")

export { hostScheme }