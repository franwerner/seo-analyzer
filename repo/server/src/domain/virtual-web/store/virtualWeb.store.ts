
import OpenAi from "@/infrastructure/AI/openAi.service"
import PuppeterService from "@/infrastructure/scrapper/puppeter.service"
import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error"
import VirtualWebEntity, { VirtualWebEntityProps } from "@/domain/virtual-web/virtualWeb.entity"
import StoreLockHelper from "@/domain/shared/helpers/StoreLock.helper"

const timeoutDuration = 1000 * 60 * 0.1 // 5M
const maxVDomDuration = 1000 * 60 * 0.5 //30M

interface CreateVirtualWebProps extends Omit<VirtualWebEntityProps, "url"> {
    host: string
}


class VirtualWebStore {

    /**
     * Hacer limpieza de los virtualDOM cuando tengan un tiempo sin utilizarse para ahorrar recursos.
     */
    private store: Map<number, VirtualWebEntity> = new Map()
    private timeout: NodeJS.Timeout | null = null
    private virtualWebLastTouch = new Map<VirtualWebEntity, number>()
    private lockStore: StoreLockHelper<VirtualWebEntity> = new StoreLockHelper()

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
    ) { }


    private create(props: CreateVirtualWebProps) {
        const vdom = new VirtualWebEntity(this.openAi, this.puppeteer, props)
        this.touch(vdom)
        this.store.set(props.id, vdom)
        return vdom
    }

    getOrCreate(id: number, fn: (create: VirtualWebStore["create"]) => Promise<VirtualWebEntity>) {
        const store = this.get(id)
        if (store) return store
        /**
         * En caso de que no existe permite la creacion a travez de un lockeo.
         */
        return this.lockStore.lock(id, () => fn(this.create.bind(this)))
    }

    async getOrThrow(id: number) {
        const virtualWeb = await this.get(id)
        if (!virtualWeb) throw new VirtualWebNotFound()
        return virtualWeb
    }


    get(id: number) {
        const locked = this.lockStore.locked.get(id)
        if (locked) return locked
        const virtualWeb = this.store.get(id)
        virtualWeb && this.touch(virtualWeb)
        return virtualWeb
    }

    remove(id: number) {
        this.store.delete(id)
    }

    private touch(virtualWeb: VirtualWebEntity) {
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
            this.virtualWebLastTouch.forEach((lastTouch, vWeb) => {
                if (now - lastTouch >= maxVDomDuration) {
                    this.virtualWebLastTouch.delete(vWeb)
                    /**
                     * Aca tendriamos que crear un metood en el VirtualWeb que se encargue de verificar si hay algun virtualDom con un analisis activo.
                     */
                    this.store.delete(vWeb.id)
                    console.log(`VirtualWeb ${vWeb.host} removed for inactivity`)
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
