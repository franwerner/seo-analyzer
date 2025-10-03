import VirtualDom from "../models/virtualDom.model";
import ErrorHandler from "@/utils/errorHandler.utils";
import URLUtility from "@/utils/URL.util";
import PuppeterService from "@/services/puppeter.service";
import DomValidator from "@/domain/virtual-dom/services/dom-validator";


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
