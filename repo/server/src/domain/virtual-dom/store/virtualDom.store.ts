import URLUtility from "@/domain/shared/utils/URL.util";
import OpenAi from "@/infrastructure/AI/openAi.service";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import VirtualDomNotFountError from "../errors/VirtualDomNotFount.error";
import VirtualDom from "../virtualDom.entity";
import DomAnalysis from "../services/dom-analysis";
import StoreLockHelper from "@/domain/shared/helpers/StoreLock.helper";

interface VirtualDomStoreProps {
    host: string
}

interface CreateVirtualDomProps {
    pathname: string
    id: number
}

export default class VirtualDomStore {
    private store: Map<number, VirtualDom> = new Map()
    private lockStore: StoreLockHelper<VirtualDom> = new StoreLockHelper()
    host: string
    constructor(
        private openAi: OpenAi,
        private scrapperService: PuppeterService,
        { host }: VirtualDomStoreProps
    ) {
        this.host = host
    }

    private create({ pathname, id }: CreateVirtualDomProps) {
        const url = URLUtility.createURL({ host: this.host, pathname })
        const domAnalysis = new DomAnalysis(this.openAi)
        const virtualDom = new VirtualDom(this.scrapperService, domAnalysis, { url, id })
        this.store.set(id, virtualDom)
        return virtualDom
    }

    async getOrCreate(virtualDomId: number, fn: (create: VirtualDomStore["create"]) => Promise<VirtualDom>) {
        const virtualDomExists = this.store.get(virtualDomId)
        if (virtualDomExists) return virtualDomExists
        return this.lockStore.lock(virtualDomId, () => fn(this.create.bind(this)))
    }

    get(id: number) {
        const locked = this.lockStore.getLock(id)
        if (locked) return locked
        return this.store.get(id)
    }

    async getOrThrow(id: number) {
        const virtualDomExists = await this.get(id)
        if (!virtualDomExists) throw new VirtualDomNotFountError()
        return virtualDomExists
    }

    remove(id: number) {
        this.store.delete(id)
    }
}
