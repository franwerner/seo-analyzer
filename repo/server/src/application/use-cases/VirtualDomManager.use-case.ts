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
        const virtualWebEntity = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        const virtualDomEntity = await virtualWebEntity.vdomStore.getOrCreate(virtualDomId, async (create) => {
            const virtualDom = await this.repositories.virtualDomRepository.findByRelation(props)
            if (!virtualDom) throw new VirtualDomNotFountError()
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
        return {
            virtualWebEntity,
            virtualDomEntity
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
            virtualDomEntity,
            virtualWebEntity
        } = await this.getVirtualDomOrThrow({
            virtualWebId,
            virtualDomId
        })

        const summary = virtualWebEntity.getOrThrowVirtualWebSummary()

        const { issues, tokens, model } = await virtualDomEntity.analyze(summary.content, validationsSelected)

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