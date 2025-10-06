
import URLUtility from "@/shared/utils/URL.util"
import OpenAi from "@/infrastructure/AI/openAi.service"
import VirtualWeb, { VirtualWebProps } from "../virtualWeb.entity"
import PuppeterService from "@/infrastructure/scrapper/puppeter.service"
import VirtualWebAlreadyExists from "../errors/VirtualWebAlreadyExists.error"
import VirtualWebNotFound from "../errors/VirtualWebNotFount.error"
import CreateVirtualWebDTO from "@/application/dtos/CreateVirtualWeb.dto"

const timeoutDuration = 1000 * 60 * 5 // 5M
const maxVDomDuration = 1000 * 60 * 30 //30M

class VirtualWebStore {

    /**
     * Hacer limpieza de los virtualDOM cuando tengan un tiempo sin utilizarse para ahorrar recursos.
     */
    private store: Map<string, VirtualWeb>
    private timeout: NodeJS.Timeout | null = null
    private virtualWebLastTouch = new Map<VirtualWeb, number>()

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,

    ) {
        this.store = new Map()
    }

    private create({ url, webSummary }: VirtualWebProps) {
        const vdom = new VirtualWeb(this.openAi, this.puppeteer, { url, webSummary })
        this.touch(vdom)
        this.store.set(url.host, vdom)
        return vdom
    }

    createIfNotExists(props: CreateVirtualWebDTO) {
        const url = URLUtility.createURL({ host: props.host, pathname: props.pathname })
        if (this.store.has(url.host)) throw new VirtualWebAlreadyExists()
        return this.create({ url, webSummary: props.webSummary })
    }

    getOrThrow(host: string) {
        const virtualWeb = this.store.get(URLUtility.normalizeHost(host))
        if (!virtualWeb) throw new VirtualWebNotFound()

        this.touch(virtualWeb)
        return virtualWeb
    }

    remove(host: string) {
        this.store.delete(URLUtility.normalizeHost(host))
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
        // if (this.timeout !== null) return
        // this.timeout = setTimeout(() => {
        //     const now = Date.now()
        //     this.virtualWebLastTouch.forEach((lastTouch, vWeb) => {
        //         if (now - lastTouch >= maxVDomDuration) {
        //             this.virtualWebLastTouch.delete(vWeb)
        //             /**
        //              * Aca tendriamos que crear un metood en el VirtualWeb que se encargue de verificar si hay algun virtualDom con un analisis activo.
        //              */
        //             this.store.delete(vWeb.url.host)
        //             console.log(`VirtualWeb ${vWeb.url.host} removed for inactivity`)
        //         }
        //     })
        //     this.timeout = null
        //     if (this.virtualWebLastTouch.size > 0) {
        //         this.scheduleCleanup()
        //     }
        // }, timeoutDuration)
    }

}

export default VirtualWebStore
