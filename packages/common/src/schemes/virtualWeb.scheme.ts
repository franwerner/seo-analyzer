import { z } from "zod"
import { dateScheme } from "./date.scheme"
import hostScheme from "./host.scheme"
import pathnameScheme from "./pathname.scheme"

export const virtualWebScheme = z.object({
    id: z.number(),
    host: hostScheme,
    createdAt: dateScheme,
    virtualDomCount: z.number(),
    virtualWebConfig: z.object({
        virtualDom: z.object({
            id: z.number(),
            pathname: pathnameScheme,
        })
    })
})


export type VirtualWeb = z.infer<typeof virtualWebScheme>