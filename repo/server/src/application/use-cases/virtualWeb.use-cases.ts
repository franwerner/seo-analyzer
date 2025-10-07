import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import CreateVirtualWebDTO from "../dtos/CreateVirtualWeb.dto";
import VirtualDomUseCases from "./virtualDom.use-cases";
import CreateAnalyzeSinglePageDto from "../dtos/CreateAnalyzeSinglePage.dto";

export default class VirtualWebUseCases {
    constructor(
        private virtualWebStore: VirtualWebStore,
        private virtualDomUseCases: VirtualDomUseCases
    ) { }

    async registerVirtualWeb(props: CreateVirtualWebDTO) {
        const virtualWeb = this.virtualWebStore.createIfNotExists(props)
        if (!props.webSummary) {
            await virtualWeb.setWebSummary()
        }
        return virtualWeb
    }

    createAnalyzeSinglePage({ path, host, validationsSelected }: CreateAnalyzeSinglePageDto) {
        const virtualWeb = this.virtualWebStore.getOrThrow(host)
        return this.virtualDomUseCases.createAnalyzeDom(virtualWeb.vdomStore, {
            path,
            pageSummary: virtualWeb.webSummary?.summary || "",
            validationsSelected
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