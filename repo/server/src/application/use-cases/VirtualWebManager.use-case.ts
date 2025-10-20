import { VirtualWebNotFountError } from "@/domain/virtual-web/errors"
import VirtualWebConfigNotFountError from "@/domain/virtual-web/errors/VirtualWebConfigNotFount.error"
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store"
import {
    createVirtualWebSummaryScheme,
    UpdateVirtualWebDTO,
    updateVirtualWebScheme
} from "@seo-analyzer/common"
import VirtualWebRepository from "../repositories/VirtualWeb.repository"
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository"
import toDecimal from "../shared/utils/toDecimal.utils"

export default class VirtualWebManagerUsecase {

    constructor(
        private virtualWebStore: VirtualWebStore,
        private repositories: {
            virtualWebRepository: VirtualWebRepository,
            virtualWebSummaryRepository: VirtualWebSummaryRepository,
        }
    ) { }

    async getVirtualWebOrThrow(virtualWebId: number) {
        return await this.virtualWebStore.getOrCreate(virtualWebId, async (create) => {
            const repoVirtualWeb = await this.repositories.virtualWebRepository.findUniqueWithConfigAndSummary(virtualWebId)
            if (!repoVirtualWeb) throw new VirtualWebNotFountError()
            else if (!repoVirtualWeb.virtualWebConfig) throw new VirtualWebConfigNotFountError()
            const { virtualWebConfig, host, id, virtualWebSummary } = repoVirtualWeb
            return create({
                id,
                host,
                virtualWebConfig,
                virtualWebSummary
            })
        })
    }

    async updateVirtualWeb(props: UpdateVirtualWebDTO["input"]) {
        const res = await this.repositories.virtualWebRepository.update(props)
        const virtualWebLock = await this.virtualWebStore.get(props.id)
        if (virtualWebLock) {
            virtualWebLock.setHost(res.host)
        }
        return res
    }

    async createVirtualWebSummary(virtualWebId: number) {
        const virtualWeb = await this.getVirtualWebOrThrow(virtualWebId)
        const { content, usage, model } = await virtualWeb.generateWebSummary()
        const res = await this.repositories.virtualWebSummaryRepository.createSummaryAggregate({
            virtualWebId: virtualWebId,
            content,
            AIUsage: {
                input: toDecimal(usage.input),
                output: toDecimal(usage.output),
                model
            }
        })
        const virtualWebSummary = {
            ...res,
            content
        }
        virtualWeb.setVirtualWebSummary(virtualWebSummary)
        return {
            ...virtualWebSummary,
            summaryUsage: usage
        }
    }

}