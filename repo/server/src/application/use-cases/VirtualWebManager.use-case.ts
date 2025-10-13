import { VirtualWebNotFountError } from "@/domain/virtual-web/errors"
import VirtualWebRepository from "../repositories/VirtualWeb.repository"
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository"
import VirtualWebStore from "../../domain/virtual-web/store/virtualWeb.store"
import VirtualWebConfigNotFountError from "@/domain/virtual-web/errors/VirtualWebConfigNotFount.error"
import createVirtualWebScheme, { CreateVirtualWebDTO } from "../dtos/CreateVirtualWeb.dto"
import ValidateDTO from "../decorators/ValidateDTO.decorator"

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
            const repoVirtualWeb = await this.repositories.virtualWebRepository.findUniqueWithConfig(virtualWebId)
            if (!repoVirtualWeb) throw new VirtualWebNotFountError()
            else if (!repoVirtualWeb.virtualWebConfig) throw new VirtualWebConfigNotFountError()
            const { virtualWebConfig, virtualWeb } = repoVirtualWeb
            const webSummary = await this.repositories.virtualWebSummaryRepository.findUniqueBySourceVirtualDomId(virtualWebConfig.mainVirtualDomId)
            return create({
                id: virtualWeb.id,
                host: virtualWeb.host,
                webConfig: virtualWebConfig,
                webSummary: webSummary
            })
        })
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
                host: virtualWeb.host,
                webConfig: {
                    mainVirtualDomId: virtualWebConfig.mainVirtualDomId,
                    mainPathname: virtualWebConfig.mainPathname
                }
            })
        })
    }

}