import { z } from "zod"
import { pathnameScheme } from "../schemes/pathname.scheme"
import { VirtualDom } from "@/types/VirtualDom.interface"


export const createVirtualDomScheme = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

export type CreateVirtualDomDTO = {
    input: z.infer<typeof createVirtualDomScheme>,
    output: VirtualDom
}
