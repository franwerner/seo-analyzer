import { z } from "zod"

export const dateScheme = z.union([z.date(), z.string()])