import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import { CreateVirtualWebDTO, createVirtualWebScheme, hostScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import ValidateDTO from "../shared/utils/validateDTO.utils";

export default class VirtualWebStoredUseCase {

    constructor(
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    getVirtualWebs(skip: number) {
        return this.repositories.virtualWebRepository.findAll(skip)
    }

    createVirtualWeb(props: CreateVirtualWebDTO["input"]) {
        const validatedData = ValidateDTO(createVirtualWebScheme, props)
        return this.repositories.virtualWebRepository.createVirtualWebAggregate(validatedData)
    }

    async getVirtualWebDetails(id: number) {
        const [
            virtualWeb,
            analysisUsage,
            summaryUsage,
        ] = await Promise.all([
            this.repositories.virtualWebRepository.findUniqueWithConfigAndSummary(id),
            this.repositories.virtualWebRepository.sumAnalysisUsage(id),
            this.repositories.virtualWebRepository.sumSummaryUsage(id)
        ])

        if (!virtualWeb) {
            throw new VirtualWebNotFound()
        }
        return {
            ...virtualWeb,
            analysisUsage,
            summaryUsage,
        }
    }

    getVirtualWebByHost(host: string) {
        const normalized = hostScheme.parse(host)
        return this.repositories.virtualWebRepository.findByHost(normalized)
    }

}