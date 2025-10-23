import { z } from "zod"

const pathnameScheme = z
    .string()
    .default("/")
    .transform((val) => {
        let normalized = val.trim()

        if (!normalized.startsWith("/")) normalized = "/" + normalized

        normalized = normalized.replace(/\/{2,}/g, "/")

        if (normalized.length > 1) normalized = normalized.replace(/\/+$/, "")

        return normalized
    })
    .refine(
        (val) => /^\/[a-zA-Z0-9\-_\/]*$/.test(val),
        "Pathname must contain only letters, numbers, dashes, and slashes"
    )
export { pathnameScheme }
