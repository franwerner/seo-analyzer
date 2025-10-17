import { z } from "zod"
import pathnameScheme from "./pathname.scheme"
import { dateScheme } from "./date.scheme"

export const virtualDomScheme = z.object({
    id: z.number(),
    virtualWebId: z.number(),
    pathname: pathnameScheme,
    createdAt: dateScheme,
})

export type VirtualDom = z.infer<typeof virtualDomScheme>
