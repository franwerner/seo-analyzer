import ErrorHandler from "../utils/errorHandler.utils"
import OpenAi from "./openAi.service"
import PuppeterService from "./puppeter.service"
import VirtualDom from "./virtualDom.service"

class VirtualDomStore {

    /**
     * Hacer limpieza de los virtualDOM cuando tengan un tiempo sin utilizarse para ahorrar recursos.
     */
    private static readonly regexpHttps = /https?:\/\//i
    private store: Map<string, VirtualDom>
    private openAi: OpenAi
    private puppeteer: PuppeterService

    constructor() {
        this.store = new Map()
        this.openAi = new OpenAi()
        this.puppeteer = new PuppeterService()
    }


    static normalizedUrl(url: string) {
        try {
            if (!VirtualDomStore.regexpHttps.test(url)) {
                url = `https://${url}`;
            }
            const instance = new URL(url)
            const pathname = instance.pathname.endsWith("/") ? instance.pathname.slice(0, -1) : instance.pathname
            const finalUrl = instance.host + pathname
            return finalUrl
        } catch (error) {
            throw new ErrorHandler({
                message: "Invalid URL",
                status_code: 400
            })
        }
    }

    createOrGet(input: string) {
        const url = VirtualDomStore.normalizedUrl(input)
        const getVDOM = this.store.get(url)
        if (getVDOM) {
            return getVDOM
        }
        const vdom = new VirtualDom(this.openAi, this.puppeteer, { path: url })
        this.store.set(url, vdom)
        return vdom
    }

    getIfExist(url: string) {
        const virtualDom = this.store.get(VirtualDomStore.normalizedUrl(url))
        if (!virtualDom) {
            throw new ErrorHandler({
                message: "VirtualDom not found",
                status_code: 404
            })
        }
        return virtualDom
    }

}

export default VirtualDomStore
