import { VirtualWebProps } from "@/domain/virtual-web/virtualWeb.entity";
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import { virtualDomUseCases } from "@/infrastructure/bootstrap";

export default class VirtualWebUseCases {
    constructor(
        private virtualWebStore: VirtualWebStore
    ) { }

    async registerVirtualWeb({ host, mainPathname, webSummary }: VirtualWebProps) {
        const virtualWeb = this.virtualWebStore.createIfNotExists({ host, mainPathname, webSummary })
        // await virtualWeb.setWebSummary()
        return virtualWeb
    }

    analyzeSinglePage(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return virtualDomUseCases.analyzeDom(virtualWeb.vdomStore, {
            path,
            pageSummary: virtualWeb.webSummary?.summary || ""
        })
    }

    getSinglePageAnalysis(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return virtualDomUseCases.getDomAnalysis(virtualWeb.vdomStore, path)
    }

    getPage(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return virtualDomUseCases.getDom(virtualWeb.vdomStore, path)
    }

}