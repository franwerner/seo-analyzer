import { z } from "zod"

export const paginationScheme = z.object({
    has: z.boolean(),
    skip: z.number(),
})

export type Pagination = z.infer<typeof paginationScheme>