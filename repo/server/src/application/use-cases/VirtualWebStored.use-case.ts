import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import { CreateVirtualWebDTO, createVirtualWebScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import validateInputDTO from "../shared/utils/validateInputDTO.utils";

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
        const validatedData = validateInputDTO(createVirtualWebScheme, props)
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

}