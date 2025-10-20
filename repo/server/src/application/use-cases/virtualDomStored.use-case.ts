import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors";
import { CreateVirtualDomDTO, createVirtualDomScheme, getVirtualDomAnalysesScheme, getVirtualDomAnalysisScheme, getVirtualDomDetailsScheme, getVirtualDomsScheme } from "@seo-analyzer/common";
import VirtualDomRepository from "../repositories/VirtualDom.repository";
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository";
import validateOutputDTO from "../shared/utils/validateOutputDTO.utils";
import validateInputDTO from "../shared/utils/validateInputDTO.utils";

export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    async createVirtualDom(data: CreateVirtualDomDTO["input"]) {
        const validatedData = validateInputDTO(createVirtualDomScheme.input, data)
        return validateOutputDTO(
            createVirtualDomScheme.output,
            await this.repositories.virtualDomRepository.create({
                virtualWebId: validatedData.virtualWebId,
                pathname: validatedData.pathname,
            })
        )
    }

    async getVirtualDoms(props: { virtualWebId: number, skip: number }) {
        return validateOutputDTO(
            getVirtualDomsScheme.output,
            await this.repositories.virtualDomRepository.findByVirtualWeb(props)
        )
    }

    async getVirtualDomAnalyses(id: number) {
        return validateOutputDTO(
            getVirtualDomAnalysesScheme.output,
            await this.repositories.virtualDomAnalysisRepository.findByVirtualDom({ virtualDomId: id })
        )
    }

    async getVirtualDomAnalysis(id: number) {
        return validateOutputDTO(
            getVirtualDomAnalysisScheme.output,
            await this.repositories.virtualDomAnalysisRepository.findUniqueWithIssues({ id })
        )
    }

    async getVirtualDomDetails(id: number) {
        const [virtualDom, analysesUsage] = await Promise.all([
            await this.repositories.virtualDomRepository.findUniqueWithVirtualWeb({ id }),
            await this.repositories.virtualDomRepository.findAnalysisUsage({ id })
        ])
        if (!virtualDom) throw new VirtualDomNotFountError()

        return validateOutputDTO(
            getVirtualDomDetailsScheme.output,
            {
                ...virtualDom,
                analysesUsage
            }
        )
    }
}