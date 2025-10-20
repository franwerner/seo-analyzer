import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors";
import { CreateVirtualDomDTO } from "@seo-analyzer/common";
import VirtualDomRepository from "../repositories/VirtualDom.repository";
import VirtualDomAnalysisRepository from "../repositories/VirtualDomAnalysis.repository";
export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
            virtualDomAnalysisRepository: VirtualDomAnalysisRepository
        }
    ) { }

    createVirtualDom(data: CreateVirtualDomDTO["input"]) {
        return this.repositories.virtualDomRepository.create({
            virtualWebId: data.virtualWebId,
            pathname: data.pathname,
        })
    }

    async getVirtualDoms(props: { virtualWebId: number, skip: number }) {
        return await this.repositories.virtualDomRepository.findByVirtualWeb(props)
    }

    getVirtualDomAnalyses(id: number) {
        return this.repositories.virtualDomAnalysisRepository.findByVirtualDom({ virtualDomId: id })
    }

    getVirtualDomAnalysis(id: number) {
        return this.repositories.virtualDomAnalysisRepository.findUniqueWithIssues({ id })
    }

    async getVirtualDomDetails(id: number) {
        const [virtualDom, analysesUsage] = await Promise.all([
            await this.repositories.virtualDomRepository.findUniqueWithVirtualWeb({ id }),
            await this.repositories.virtualDomRepository.findAnalysisUsage({ id })
        ])
        if (!virtualDom) throw new VirtualDomNotFountError()

        return {
            ...virtualDom,
            analysesUsage
        }
    }
}