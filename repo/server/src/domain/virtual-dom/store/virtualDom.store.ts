import URLUtility, { URLInterface } from "@/shared/utils/URL.util";
import DomValidator from "@/domain/virtual-dom/services/dom-validator";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import OpenAi from "@/infrastructure/AI/openAi.service";
import VirtualDom from "../virtualDom.entity";
import VirtualDomNotFountError from "../services/errors/VirtualDomNotFount.error";

interface VirtualDomStoreProps {
    host: string
}

export default class VirtualDomStore {
    private store: Map<string, VirtualDom> = new Map()
    host: string
    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { host }: VirtualDomStoreProps
    ) {
        this.host = host
    }

    private create({ url }: { url: URLInterface }) {
        const domValidator = new DomValidator(this.openAi)
        const virtualDom = new VirtualDom(this.puppeteer, domValidator, { url })
        this.store.set(url.pathname, virtualDom)
        return virtualDom
    }

    getOrCreate(pathname: string) {
        const url = URLUtility.createURL({ host: this.host, pathname })
        const virtualDomExists = this.store.get(url.pathname)
        if (virtualDomExists) return virtualDomExists
        return this.create({ url })
    }

    getOrThrow(pathname: string) {
        const virtualDomExists = this.store.get(URLUtility.normalizePathname(pathname))
        if (!virtualDomExists) throw new VirtualDomNotFountError()
        return virtualDomExists
    }

    remove(pathname: string) {
        this.store.delete(URLUtility.normalizePathname(pathname))
    }
}
