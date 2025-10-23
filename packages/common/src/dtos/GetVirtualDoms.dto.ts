import { VirtualDom } from "@/types/VirtualDom.interface"
import { Pagination } from "@/types/Pagination.interface"


export interface GetVirtualDomsDTO {
    virtualDoms: VirtualDom[],
    pagination: {
        next: Pagination
    }
}