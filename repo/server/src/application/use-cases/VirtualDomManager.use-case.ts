import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import { CreateVirtualDomAnalysisDTO, createVirtualDomAnalysisScheme } from "@seo-analyzer/common"
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository"
import ValidateDTO from "../shared/utils/validateInputDTO.utils"
import VirtualWebManagerService from "./VirtualWebManager.use-case"

export default class VirtualDomManagerUseCase {
    constructor(
        private virtualWebManagerService: VirtualWebManagerService,
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    async getVirtualDomOrThrow(props: { virtualWebId: number, id: number }) {
        const { virtualWebId, id } = props
        const virtualWebEntity = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        const virtualDomEntity = await virtualWebEntity.vdomStore.getOrCreate(id, async (create) => {
            const virtualDom = await this.repositories.virtualDomRepository.findByRelation(props)
            /**
             * `findByRelation` debe hacerse asi para asegurar al 100% la relacion con virtualWeb,
             * Ya que la store no hace la validacion ni garantiza esta relacion.
             */
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

    async createVirtualDomAnalysis(props: CreateVirtualDomAnalysisDTO["input"]) {

        const validatedData = ValidateDTO(createVirtualDomAnalysisScheme.input, props)
        const { id, virtualWebId, validationsSelected } = validatedData

        const {
            virtualDomEntity,
            virtualWebEntity
        } = await this.getVirtualDomOrThrow({
            virtualWebId,
            id
        })

        const summary = virtualWebEntity.getOrThrowVirtualWebSummary()

        const { issues, usage, model } = await virtualDomEntity.analyze(summary.content, validationsSelected)

        const virtualDomAnalysis = await this.repositories.virtualDomAnalysisRepository.createAnalysisAggreate({
            virtualDomId: id,
            analysisIssues: issues,
            AIUsage: {
                input: usage.input,
                output: usage.output,
                model: model
            }
        })

        return {
            ...virtualDomAnalysis,
            analysisUsage: usage,
            issuesCount: virtualDomAnalysis.analysisIssues.length,
        }
    }

}

