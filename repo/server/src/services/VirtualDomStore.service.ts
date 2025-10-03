import { URLInterface } from "@/types/URL.interface";
import VirtualDom from "./virtualDom.service";
import PuppeterService from "./puppeter.service";
import OpenAi from "./openAi.service";
import ErrorHandler from "@/utils/errorHandler.utils";


export default class VirtualDomStore {
    private store: Map<string, VirtualDom> = new Map()
    host: string
    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { host }: { host: string }
    ) {
        this.openAi = openAi
        this.puppeteer = puppeteer
        this.host = host
    }

    private normalizePathname(pathname: string) {
        //Siempre retornar con / al inicio y sin el ultimo slash
        const pathWithoutLastSlash = pathname.replace(/\/$/, "")
        if (!pathWithoutLastSlash.startsWith("/")) return `/${pathWithoutLastSlash}`
        return pathWithoutLastSlash
    }

    private createURL(pathname: string): URLInterface {
        const normalizedPathname = this.normalizePathname(pathname)
        return {
            host: this.host,
            pathname: normalizedPathname,
            href: `https://${this.host}${normalizedPathname}`
        }
    }

    getOrCreate(pathname: string) {
        const virtualDomExists = this.store.get(this.normalizePathname(pathname))
        if (virtualDomExists) return virtualDomExists
        const virtualDom = new VirtualDom(this.openAi, this.puppeteer, { url: this.createURL(pathname) })
        this.store.set(this.normalizePathname(pathname), virtualDom)
        return virtualDom
    }

    getOrThrow(pathname: string) {
        const virtualDomExists = this.store.get(this.normalizePathname(pathname))
        if (!virtualDomExists) throw new ErrorHandler({
            message: "VirtualDom not found",
            status_code: 404
        })
        return virtualDomExists
    }

    deleteVirtualDom(pathname: string) {
        this.store.delete(this.normalizePathname(pathname))
    }
}
