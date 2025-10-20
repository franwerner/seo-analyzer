import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import { CreateVirtualWebDTO, createVirtualWebScheme, getVirtualWebDetailsScheme, getVirtualWebsScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import validateOutputDTO from "../shared/utils/validateOutputDTO.utils";
import validateInputDTO from "../shared/utils/validateInputDTO.utils";

export default class VirtualWebStoredUseCase {

    constructor(
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    async getVirtualWebs(skip?: number) {
        const res = await this.repositories.virtualWebRepository.findAll(skip)
        return validateOutputDTO(getVirtualWebsScheme.output, res)
    }

    async createVirtualWeb(props: CreateVirtualWebDTO["input"]) {
        const validatedData = validateInputDTO(createVirtualWebScheme.input, props)
        return validateOutputDTO(createVirtualWebScheme.output,
            await this.repositories.virtualWebRepository.createVirtualWebAggregate(validatedData)
        )
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
        return validateOutputDTO(getVirtualWebDetailsScheme.output, {
            ...virtualWeb,
            analysisUsage,
            summaryUsage,
        })
    }

}