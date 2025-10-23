import { hostScheme } from "../schemes/host.scheme"
import { pathnameScheme } from "../schemes/pathname.scheme"
import { z } from "zod"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"
import { InferDTO } from "../types/InferDTO.type"


const input = z.object({
    host: hostScheme,
    mainPathname: pathnameScheme,
})

const output = virtualWebScheme

export const createVirtualWebScheme = {
    input,
    output
}
export type CreateVirtualWebDTO = InferDTO<typeof createVirtualWebScheme>
