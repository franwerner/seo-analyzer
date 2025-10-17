import z from "zod";

export const usageScheme = z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
})

export type Usage = z.infer<typeof usageScheme>