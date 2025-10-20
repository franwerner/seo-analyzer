import { usageScheme, virtualDomScheme, virtualWebScheme } from "@/schemes"
import { InferDTO } from "@/types/InferDTO.type"


const output = virtualDomScheme.omit({
    virtualWebId: true,
}).extend({
    analysesUsage: usageScheme,
    virtualWeb: virtualWebScheme.pick({
        id: true,
        host: true
    })
})

const input = null

export const getVirtualDomDetailsScheme = {
    input,
    output
}


export type GetVirtualDomDetailsDto = InferDTO<typeof getVirtualDomDetailsScheme>