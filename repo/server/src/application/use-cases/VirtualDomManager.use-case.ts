import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import { CreateVirtualDomAnalysisDTO, createVirtualDomAnalysisScheme, hostScheme, pathnameScheme } from "@seo-analyzer/common"
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository"
import ValidateDTO from "../shared/utils/validateDTO.utils"
import VirtualWebManagerService from "./VirtualWebManager.use-case"
import PuppeterService from "@/infrastructure/scrapper/puppeter.service"


export default class VirtualDomManagerUseCase {
    constructor(
        private virtualWebManagerService: VirtualWebManagerService,
        private puppeterService: PuppeterService,
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

        const validatedData = ValidateDTO(createVirtualDomAnalysisScheme, props)
        const { host, pathname, validationsSelected, snapshotId, htmlString } = validatedData

        const normalized = {
            host: hostScheme.parse(host),
            pathname: pathnameScheme.parse(pathname)
        }

        const res = await this.repositories.virtualDomRepository.findUniqueByHostAndPath({
            host: normalized.host,
            pathname: normalized.pathname
        })

        if (!res) {
            throw new VirtualDomNotFountError()
        }

        const { virtualWebId, id: virtualDomId } = res

        const {
            virtualDomEntity,
            virtualWebEntity
        } = await this.getVirtualDomOrThrow({
            virtualWebId,
            id: virtualDomId
        })

        const summary = virtualWebEntity.getOrThrowVirtualWebSummary()

        const { issues, usage, model } = await virtualDomEntity.analyze({
            domSummary: summary.content,
            validationsSelected,
            htmlElement: this.puppeterService.createJSDOM(htmlString),
            snapshotId
        })

        const virtualDomAnalysis = await this.repositories.virtualDomAnalysisRepository.createAnalysisAggreate({
            virtualDomId: virtualDomId,
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

