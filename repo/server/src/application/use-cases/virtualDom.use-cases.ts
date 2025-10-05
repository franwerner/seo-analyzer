import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store"

export default class VirtualDomUseCases {
    constructor(
        //Aca para el repositorio
    ) { }

    analyzeDom(virtualWebStore: VirtualDomStore, path: string) {
        const virtualDom = virtualWebStore.getOrThrow(path)
        return virtualDom.analyze("test")
    }

    getDomAnalysis(virtualWebStore: VirtualDomStore, path: string) {
        const virtualDom = virtualWebStore.getOrThrow(path)
        return virtualDom.domValidator.getValidations()
    }
}