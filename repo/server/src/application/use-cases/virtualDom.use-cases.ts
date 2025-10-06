import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store"
import CreateAnalyzeDomDto from "../dtos/CreateAnalyzeDom.dto"

export default class VirtualDomUseCases {
    constructor(
        //Aca para el repositorio
    ) { }

    createAnalyzeDom(virtualWebStore: VirtualDomStore, { path, pageSummary, validationTypes }: CreateAnalyzeDomDto) {
        const virtualDom = virtualWebStore.getOrCreate(path)
        return virtualDom.analyze(pageSummary, validationTypes)
    }

    getDomAnalysis(virtualWebStore: VirtualDomStore, path: string) {
        const virtualDom = virtualWebStore.getOrThrow(path)
        return virtualDom.domValidator.getValidations()
    }

    getDom(virtualWebStore: VirtualDomStore, path: string) {
        const virtualDom = virtualWebStore.getOrCreate(path)
        return virtualDom
    }
}