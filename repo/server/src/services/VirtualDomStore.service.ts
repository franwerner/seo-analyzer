import ErrorHandler from "../utils/errorHandler.utils"
import OpenAi from "./openAi.service"
import PuppeterService from "./puppeter.service"
import VirtualDom from "./virtualDom.service"

const timeoutDuration = 1000 * 60 * 5 // 5M
const maxVDomDuration = 1000 * 60 * 30 //30M
const regexpHttps = /https?:\/\//i

class VirtualDomStore {

    /**
     * Hacer limpieza de los virtualDOM cuando tengan un tiempo sin utilizarse para ahorrar recursos.
     */
    private store: Map<string, VirtualDom>
    private timeout: NodeJS.Timeout | null = null
    private virtualDomLastTouch = new Map<VirtualDom, number>()
    private openAi: OpenAi
    private puppeteer: PuppeterService

    constructor() {
        this.store = new Map()
        this.openAi = new OpenAi()
        this.puppeteer = new PuppeterService()
    }


    private static normalizedUrl(url: string) {
        try {
            if (!regexpHttps.test(url)) {
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

    getOrCreate(input: string) {
        const url = VirtualDomStore.normalizedUrl(input)
        const getVDOM = this.store.get(url)
        if (getVDOM) return getVDOM
        const vdom = new VirtualDom(this.openAi, this.puppeteer, { path: url })
        this.store.set(url, vdom)
        this.touch(vdom)
        return vdom
    }

    getOrThrow(url: string) {
        const virtualDom = this.store.get(VirtualDomStore.normalizedUrl(url))
        if (!virtualDom) throw new ErrorHandler({
            message: "VirtualDom not found",
            status_code: 404
        })

        this.touch(virtualDom)
        return virtualDom
    }

    private touch(virtualDom: VirtualDom) {
        /**
         * Basicamente se encarga de marcar el virtualDom cuando fue la ultima vez que se utilizo,
         * para que pueda ser limpiado si es que esta inactivo hace un tiempo x.
         */
        this.virtualDomLastTouch.set(virtualDom, Date.now())
        this.scheduleCleanup()
    }

    private scheduleCleanup() {
        if (this.timeout !== null) return
        this.timeout = setTimeout(() => {
            const now = Date.now()
            this.virtualDomLastTouch.forEach((lastTouch, vdom) => {
                if (now - lastTouch >= maxVDomDuration) {
                    this.virtualDomLastTouch.delete(vdom)
                    vdom.clearSnapshot()
                }
            })
            this.timeout = null
            if (this.virtualDomLastTouch.size > 0) {
                this.scheduleCleanup()
            }
        }, timeoutDuration)
    }

}

export default VirtualDomStore
