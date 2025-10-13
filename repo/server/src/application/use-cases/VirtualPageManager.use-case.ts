import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import createVirtualPageScheme, { CreateVirtualPageDTO } from "../dtos/CreateVirtualPage.dto"
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator"
import VirtualWebManagerService from "./VirtualWebManager.use-case"
import createAnalyzeSinglePageScheme, { CreateAnalyzeSinglePageDto } from "../dtos/CreateAnalyzeSinglePage.dto"
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository"

export default class VirtualPageManagerUseCase {
    constructor(
        private virtualWebManagerService: VirtualWebManagerService,
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    async getVirtualPageOrThrow(props: { virtualWebId: number, virtualDomId: number }) {
        const { virtualWebId, virtualDomId } = props
        const virtualWeb = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        const virtualPage = await virtualWeb.vdomStore.getOrCreate(virtualDomId, async (create) => {
            const virtualDom = await this.repositories.virtualDomRepository.findByVirtualWebAndDom(props)
            if (!virtualDom) throw new VirtualDomNotFountError()
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
        return {
            virtualWeb,
            virtualPage
        }
    }

    @ValidateDTO(createAnalyzeSinglePageScheme)
    async createSinglePageAnalyze({
        virtualWebId,
        virtualDomId,
        validationsSelected
    }: CreateAnalyzeSinglePageDto) {

        const {
            virtualPage,
            virtualWeb
        } = await this.getVirtualPageOrThrow({
            virtualWebId,
            virtualDomId
        })

        const summary = virtualWeb.getOrThrowMainDomSummary()

        const { issues, tokens, model } = await virtualPage.analyze(summary.content, validationsSelected)

        await this.repositories.virtualDomAnalysisRepository.createAnalysisAggreate({
            virtualDomId,
            analysisIssues: issues,
            resourceUsage: {
                ...tokens,
                source: model
            }
        })

        return {
            issues,
            tokens
        }
    }

    @ValidateDTO(createVirtualPageScheme)
    async registerVirtualPage({
        virtualWebId,
        pathname
    }: CreateVirtualPageDTO) {
        const virtualDom = await this.repositories.virtualDomRepository.create({
            virtualWebId,
            pathname,
        })
        const virtualWeb = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        return virtualWeb.vdomStore.getOrCreate(virtualDom.id, async (create) => {
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
    }

}