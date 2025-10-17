import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository"
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator"
import VirtualWebManagerService from "./VirtualWebManager.use-case"
import { CreateAnalyzeSingleDomDto, createAnalyzeSingleDomScheme } from "@seo-analyzer/common"

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

    //Falta DTO de respueta y cambiar el nombre page a DOM
    @ValidateDTO(createAnalyzeSingleDomScheme)
    async createSingleDomAnalyze({
        virtualWebId,
        virtualDomId,
        validationsSelected
    }: CreateAnalyzeSingleDomDto) {

        const {
            virtualDom,
            virtualWeb
        } = await this.getVirtualDomOrThrow({
            virtualWebId,
            virtualDomId
        })

        const summary = virtualWeb.getOrThrowVirtualWebSummary()

        const { issues, tokens, model } = await virtualDom.analyze(summary.content, validationsSelected)

        await this.repositories.virtualDomAnalysisRepository.createAnalysisAggreate({
            virtualDomId,
            analysisIssues: issues,
            AIUsage: {
                ...tokens,
                model: model
            }
        })

        return {
            issues,
            tokens
        }
    }

}