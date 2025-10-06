import { WebSummary } from "@/domain/virtual-web/types/WebSummary.interface"

interface VirtualWebDTO {
    host: string
    pathname: string
    webSummary?: WebSummary | null
}

export default VirtualWebDTO
