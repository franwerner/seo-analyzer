import { virtualDomScheme } from "@/schemes"
import { z } from "zod"
import { pathnameScheme } from "../schemes/pathname.scheme"
import { InferDTO } from "../types/InferDTO.type"


const input = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

const output = virtualDomScheme

export const createVirtualDomScheme = {
    input,
    output
}

export type CreateVirtualDomDTO = InferDTO<typeof createVirtualDomScheme>
