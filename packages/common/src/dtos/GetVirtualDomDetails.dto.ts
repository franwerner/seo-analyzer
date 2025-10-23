import { Usage } from "@/types/Usage.interface"
import { VirtualDom } from "@/types/VirtualDom.interface"
import { VirtualWeb } from "@/types/VirtualWeb.interface"



export interface GetVirtualDomDetailsDTO extends Omit<VirtualDom, 'virtualWebId'> {
    analysesUsage: Usage,
    virtualWeb: Pick<VirtualWeb, 'id' | 'host'>
}