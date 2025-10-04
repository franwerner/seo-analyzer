import VirtualDom from "../entities/virtualDom.entity";
import ErrorHandler from "@/shared/utils/errorHandler.utils";
import URLUtility from "@/shared/utils/URL.util";
import DomValidator from "@/domain/virtual-dom/services/dom-validator";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";


interface VirtualDomStoreProps {
    host: string
    domValidator: DomValidator
}

export default class VirtualDomStore {
    private store: Map<string, VirtualDom> = new Map()
    host: string
    domValidator: DomValidator
    constructor(
        private puppeteer: PuppeterService,
        { host, domValidator }: VirtualDomStoreProps
    ) {
        this.puppeteer = puppeteer
        this.host = host
        this.domValidator = domValidator
    }



    addVirtualDom(virtualDom: VirtualDom) {
        const normalizedPathname = URLUtility.normalizePathname(virtualDom.url.pathname)
        if (this.store.has(normalizedPathname)) return
        this.store.set(normalizedPathname, virtualDom)
    }

    getOrCreate(pathname: string) {
        const virtualDomExists = this.store.get(URLUtility.normalizePathname(pathname))
        if (virtualDomExists) return virtualDomExists
        const url = URLUtility.createURL({ host: this.host, pathname })
        const virtualDom = new VirtualDom(this.puppeteer, { url, domValidator: this.domValidator })
        this.store.set(URLUtility.normalizePathname(pathname), virtualDom)
        return virtualDom
    }

    getOrThrow(pathname: string) {
        const virtualDomExists = this.store.get(URLUtility.normalizePathname(pathname))
        if (!virtualDomExists) throw new ErrorHandler({
            message: "VirtualDom not found",
            status_code: 404
        })
        return virtualDomExists
    }

    deleteVirtualDom(pathname: string) {
        this.store.delete(URLUtility.normalizePathname(pathname))
    }
}
