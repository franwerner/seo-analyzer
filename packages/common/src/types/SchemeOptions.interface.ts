import z from "zod";

export interface SchemeOptions<I, O> {
    input: z.ZodType<I> | null
    output: z.ZodType<O> | null
}
