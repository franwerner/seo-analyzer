import { z } from "zod"
import { virtualWebConfigScheme } from "./virtualWebConfig.scheme"
import { dateScheme } from "./date.scheme"
import hostScheme from "./host.scheme"

export const virtualWebScheme = z.object({
    id: z.number(),
    host: hostScheme,
    createdAt: dateScheme,
    virtualDomCount: z.number()
}).merge(z.object({
    virtualWebConfig: virtualWebConfigScheme
}))


export type VirtualWeb = z.infer<typeof virtualWebScheme>