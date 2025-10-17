import { z } from "zod"
import pathnameScheme from "./pathname.scheme"

export const virtualWebConfigScheme = z.object({
    virtualDom: z.object({
        id: z.number(),
        pathname: pathnameScheme,
    })
})


export type VirtualWebConfig = z.infer<typeof virtualWebConfigScheme>
