import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors";
import { CreateVirtualDomDTO, createVirtualDomScheme, getVirtualDomAnalysesScheme, getVirtualDomAnalysisScheme, getVirtualDomDetailsScheme, getVirtualDomsScheme, virtualDomScheme } from "@seo-analyzer/common";
import VirtualDomRepository from "../repositories/VirtualDom.repository";
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository";
import validateInputDTO from "../shared/utils/validateInputDTO.utils";
import { pathnameScheme, hostScheme } from "@seo-analyzer/common";

export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    createVirtualDom(data: CreateVirtualDomDTO["input"]) {
        const validatedData = validateInputDTO(createVirtualDomScheme.input, data)
        return this.repositories.virtualDomRepository.create({
            virtualWebId: validatedData.virtualWebId,
            pathname: validatedData.pathname,
        })
    }

    async getVirtualDomByHostPath(props: { host: string, pathname: string }) {
        const pathname = pathnameScheme.parse(props.pathname)
        const host = hostScheme.parse(props.host)

        const virtualDom = await this.repositories.virtualDomRepository.findUniqueByHostAndPath({ host, pathname })
        if (!virtualDom) throw new VirtualDomNotFountError()
        return virtualDom
    }

    getVirtualDomsByVirtualWeb(props: { virtualWebId: number, skip: number }) {
        return this.repositories.virtualDomRepository.findByVirtualWeb(props)
    }

    getVirtualDomAnalyses({ virtualDomId, skip }: { virtualDomId: number, skip: number }) {
        return this.repositories.virtualDomAnalysisRepository.findByVirtualDom({ virtualDomId, skip })
    }

    getVirtualDomAnalysis({ id }: { id: number }) {
        return this.repositories.virtualDomAnalysisRepository.findUniqueWithIssues({ id })
    }

    async getVirtualDomDetails(id: number) {
        const [virtualDom, analysesUsage] = await Promise.all([
            this.repositories.virtualDomRepository.findUniqueWithVirtualWeb({ id }),
            this.repositories.virtualDomRepository.findAnalysisUsage({ id })
        ])
        if (!virtualDom) throw new VirtualDomNotFountError()

        return {
            ...virtualDom,
            analysesUsage
        }
    }
}