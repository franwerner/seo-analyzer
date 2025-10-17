import { z } from "zod"
import { dateScheme } from "./date.scheme"

export const virtualWebSummaryScheme = z.object({
    id: z.number(),
    content: z.string(),
    createdAt: dateScheme
})


export type VirtualWebSummary = z.infer<typeof virtualWebSummaryScheme>