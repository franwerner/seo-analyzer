import { VirtualWebNotFountError } from "@/domain/virtual-web/errors"
import VirtualWebRepository from "../repositories/VirtualWeb.repository"
import VirtualWebStore from "../../domain/virtual-web/store/virtualWeb.store"
import VirtualWebConfigNotFountError from "@/domain/virtual-web/errors/VirtualWebConfigNotFount.error"
import createVirtualWebScheme, { CreateVirtualWebDTO } from "../dtos/CreateVirtualWeb.dto"
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator"
import VirtualDomSummaryRepository from "../repositories/VirtualDomSummary.repository"

export default class VirtualWebManagerUsecase {

    constructor(
        private virtualWebStore: VirtualWebStore,
        private repositories: {
            virtualWebRepository: VirtualWebRepository,
            virtualDomSummaryRepository: VirtualDomSummaryRepository,
        }
    ) { }

    getVirtualWebOrThrow(virtualWebId: number) {
        return this.virtualWebStore.getOrCreate(virtualWebId, async (create) => {
            const repoVirtualWeb = await this.repositories.virtualWebRepository.findUniqueWithConfig(virtualWebId)
            if (!repoVirtualWeb) throw new VirtualWebNotFountError()
            else if (!repoVirtualWeb.virtualWebConfig) throw new VirtualWebConfigNotFountError()
            const { virtualWebConfig, virtualWeb } = repoVirtualWeb
            const mainDomSummary = await this.repositories.virtualDomSummaryRepository.findLastByVirtualDomId(virtualWebConfig.mainVirtualDomId)
            return create({
                id: virtualWeb.id,
                host: virtualWeb.host,
                webConfig: virtualWebConfig,
                mainDomSummary
            })
        })
    }

    async createMainPageSummary(virtualWebId: number) {
        const virtualWeb = await this.getVirtualWebOrThrow(virtualWebId)
        const { summary, model, tokens } = await virtualWeb.generateMainDomSummary()
        const { id: summaryId } = await this.repositories.virtualDomSummaryRepository.createSummaryAggregate({
            virtualDomId: virtualWeb.webConfig.mainVirtualDomId,
            content: summary,
            resourceUsage: {
                ...tokens,
                source: model
            }
        })
        virtualWeb.setMainDomSummary({ content: summary, id: summaryId })
    }


    @ValidateDTO(createVirtualWebScheme)
    async registerVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO) {
        const {
            virtualWeb,
            virtualWebConfig
        } = await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })
        return this.virtualWebStore.getOrCreate(virtualWeb.id, async (create) => {
            return create({
                id: virtualWeb.id,
                host,
                webConfig: {
                    mainVirtualDomId: virtualWebConfig.mainVirtualDomId,
                    mainPathname
                }
            })
        })
    }

}