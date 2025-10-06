import { WebSummary } from "@/domain/virtual-web/types/WebSummary.interface"

interface CreateVirtualWebDTO {
    host: string
    pathname: string
    webSummary?: WebSummary | null
}

export default CreateVirtualWebDTO
