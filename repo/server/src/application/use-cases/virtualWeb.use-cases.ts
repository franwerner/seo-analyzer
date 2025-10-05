import { VirtualWebProps } from "@/domain/virtual-web/entities/virtualWeb.entity";
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import { virtualDomUseCases } from "@/infrastructure/bootstrap";

export default class VirtualWebUseCases {
    constructor(
        private virtualWebStore: VirtualWebStore
    ) { }

    registerVirtualWeb({ host, mainPathname, webSummary }: VirtualWebProps) {
        return this.virtualWebStore.createIfNotExists({ host, mainPathname, webSummary })
    }

    analyzeSinglePage(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return virtualDomUseCases.analyzeDom(virtualWeb.vdomStore, path)
    }

    getSinglePageAnalysis(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return virtualDomUseCases.getDomAnalysis(virtualWeb.vdomStore, path)
    }
}