import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import OpenAiService from "@/infrastructure/AI/openAi.service";
import { CreateVirtualWebDTO, createVirtualWebScheme, getVirtualWebDetailsScheme, getVirtualWebsScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import ValidateDTO from "../shared/decorators/validateDTO.decorator";

export default class VirtualWebStoredUseCase {

    constructor(
        private AiService: OpenAiService,
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    @ValidateDTO(getVirtualWebsScheme)
    async getVirtualWebs(skip?: number) {
        return await this.repositories.virtualWebRepository.findAll(skip)
    }

    @ValidateDTO(createVirtualWebScheme)
    async createVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO["input"]) {
        return await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })
    }

    @ValidateDTO(getVirtualWebDetailsScheme)
    async getVirtualWebDetails(id: number) {

        const [
            virtualWeb,
            analysisUsageWithoutTotal,
            summaryUsageWithoutTotal,
        ] = await Promise.all([
            this.repositories.virtualWebRepository.findUniqueWithConfigAndSummary(id),
            this.repositories.virtualWebRepository.sumAnalysisUsage(id),
            this.repositories.virtualWebRepository.sumSummaryUsage(id)
        ])

        if (!virtualWeb) {
            throw new VirtualWebNotFound()
        }

        const analysisUsage = this.AiService.calculateUsageTokens(analysisUsageWithoutTotal)
        const summaryUsage = this.AiService.calculateUsageTokens(summaryUsageWithoutTotal)
        return {
            ...virtualWeb,
            analysisUsage,
            summaryUsage,
        }
    }

}
