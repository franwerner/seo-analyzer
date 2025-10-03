import ErrorHandler from "../utils/errorHandler.utils"
import OpenAi from "./openAi.service"
import PuppeterService from "./puppeter.service"
import VirtualWeb from "./VirtualWeb.service"

const timeoutDuration = 1000 * 60 * 5 // 5M
const maxVDomDuration = 1000 * 60 * 30 //30M

class VirtualWebStore {

    /**
     * Hacer limpieza de los virtualDOM cuando tengan un tiempo sin utilizarse para ahorrar recursos.
     */
    private store: Map<string, VirtualWeb>
    private timeout: NodeJS.Timeout | null = null
    private virtualWebLastTouch = new Map<VirtualWeb, number>()
    private openAi: OpenAi
    private puppeteer: PuppeterService

    constructor() {
        this.store = new Map()
        this.openAi = new OpenAi()
        this.puppeteer = new PuppeterService()
    }




    getOrCreate(host: string) {
        const getVDOM = this.store.get(host)
        if (getVDOM) return getVDOM
        const vdom = new VirtualWeb(this.openAi, this.puppeteer, { host })

        return vdom
    }

    getOrThrow(host: string) {
        const virtualWeb = this.store.get(host)
        if (!virtualWeb) throw new ErrorHandler({
            message: "VirtualWeb not found",
            status_code: 404
        })

        this.touch(virtualWeb)
        return virtualWeb
    }

    remove(host: string) {
        this.store.delete(host)
    }

    private touch(virtualWeb: VirtualWeb) {
        /**
         * Basicamente se encarga de marcar el virtualWeb cuando fue la ultima vez que se utilizo,
         * para que pueda ser limpiado si es que esta inactivo hace un tiempo x.
         */
        this.virtualWebLastTouch.set(virtualWeb, Date.now())
        this.scheduleCleanup()
    }

    private scheduleCleanup() {
        if (this.timeout !== null) return
        this.timeout = setTimeout(() => {
            const now = Date.now()
            this.virtualWebLastTouch.forEach((lastTouch, vdom) => {
                if (now - lastTouch >= maxVDomDuration) {
                    this.virtualWebLastTouch.delete(vdom)
                    /**
                     * Aca tendriamos que crear un metood en el VirtualWeb que se encargue de verificar si hay algun virtualDom con un analisis activo.
                     */
                    this.store.delete(vdom.host)
                    console.log(`VirtualWeb ${vdom.host} removed for inactivity`)
                }
            })
            this.timeout = null
            if (this.virtualWebLastTouch.size > 0) {
                this.scheduleCleanup()
            }
        }, timeoutDuration)
    }

}

export default VirtualWebStore
