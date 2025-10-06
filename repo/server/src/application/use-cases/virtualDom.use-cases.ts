import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store"

export default class VirtualDomUseCases {
    constructor(
        //Aca para el repositorio
    ) { }

    analyzeDom(virtualWebStore: VirtualDomStore, { path, pageSummary }: { path: string, pageSummary: string }) {
        const virtualDom = virtualWebStore.getOrCreate(path)
        return virtualDom.analyze(pageSummary)
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