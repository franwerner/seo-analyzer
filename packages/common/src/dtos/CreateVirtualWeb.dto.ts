import { z } from "zod"
import { hostScheme } from "../schemes/host.scheme"
import { pathnameScheme } from "../schemes/pathname.scheme"
import { VirtualWeb } from "@/types/VirtualWeb.interface"
import { VirtualWebConfig } from "@/types/VirtualWebConfig.interface"


export const createVirtualWebScheme = z.object({
    host: hostScheme,
    mainPathname: pathnameScheme,
})

export type CreateVirtualWebDTO = {
    input: z.infer<typeof createVirtualWebScheme>,
    output: VirtualWeb & { virtualWebConfig: VirtualWebConfig, virtualDomCount: number }
}
