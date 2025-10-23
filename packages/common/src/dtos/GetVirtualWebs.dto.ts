import { Pagination } from "@/types/Pagination.interface"
import { VirtualWeb } from "@/types/VirtualWeb.interface"
import { VirtualWebConfig } from "@/types/VirtualWebConfig.interface"

export interface GetVirtualWebsDTO {
    virtualWebs: Array<{
        virtualWebConfig: VirtualWebConfig,
        virtualDomCount: number
    } & VirtualWeb>,
    pagination: {
        next: Pagination
    }
}
