import { VirtualWebProps } from "@/domain/virtual-web/virtualWeb.entity";
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import VirtualDomUseCases from "./virtualDom.use-cases";
import VirtualWebDTO from "../dtos/VirtualWeb.dto";

export default class VirtualWebUseCases {
    constructor(
        private virtualWebStore: VirtualWebStore,
        private virtualDomUseCases: VirtualDomUseCases
    ) { }

    async registerVirtualWeb(props: VirtualWebDTO) {
        const virtualWeb = this.virtualWebStore.createIfNotExists(props)
        if (!props.webSummary) {
            await virtualWeb.setWebSummary()
        }
        return virtualWeb
    }

    analyzeSinglePage(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return this.virtualDomUseCases.analyzeDom(virtualWeb.vdomStore, {
            path,
            pageSummary: virtualWeb.webSummary?.summary || ""
        })
    }

    getSinglePageAnalysis(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return this.virtualDomUseCases.getDomAnalysis(virtualWeb.vdomStore, path)
    }

    getPage(host: string, path: string) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return this.virtualDomUseCases.getDom(virtualWeb.vdomStore, path)
    }

}