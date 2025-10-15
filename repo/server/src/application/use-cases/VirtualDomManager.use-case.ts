import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import createAnalyzeSinglePageScheme, { CreateAnalyzeSinglePageDto } from "../dtos/CreateAnalyzeSingleDom.dto"
import createVirtualDomScheme, { CreateVirtualDomDTO } from "../dtos/CreateVirtualDom.dto"
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository"
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator"
import VirtualWebManagerService from "./VirtualWebManager.use-case"

export default class VirtualDomManagerUseCase {
    constructor(
        private virtualWebManagerService: VirtualWebManagerService,
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    async getVirtualDomOrThrow(props: { virtualWebId: number, virtualDomId: number }) {
        const { virtualWebId, virtualDomId } = props
        const virtualWeb = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        const virtualDom = await virtualWeb.vdomStore.getOrCreate(virtualDomId, async (create) => {
            const virtualDom = await this.repositories.virtualDomRepository.findByVirtualWebAndDom(props)
            if (!virtualDom) throw new VirtualDomNotFountError()
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
        return {
            virtualWeb,
            virtualDom
        }
    }

    @ValidateDTO(createAnalyzeSinglePageScheme)
    async createSingleDomAnalyze({
        virtualWebId,
        virtualDomId,
        validationsSelected
    }: CreateAnalyzeSinglePageDto) {

        const {
            virtualDom,
            virtualWeb
        } = await this.getVirtualDomOrThrow({
            virtualWebId,
            virtualDomId
        })

        const summary = virtualWeb.getOrThrowMainDomSummary()

        const { issues, tokens, model } = await virtualDom.analyze(summary.content, validationsSelected)

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

    @ValidateDTO(createVirtualDomScheme)
    async registerVirtualDom({
        virtualWebId,
        pathname
    }: CreateVirtualDomDTO) {

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