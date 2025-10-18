import { CreateVirtualWebDTO, createVirtualWebResponseScheme, createVirtualWebScheme, getVirtualWebDetailsResponseScheme, getVirtualWebsResponseScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import OpenAiService from "@/infrastructure/AI/openAi.service";
import ValidateDTO from "../shared/decorators/validateDTO.decorator";
import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";

export default class VirtualWebStoredUseCase {

    constructor(
        private AiService: OpenAiService,
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    @ValidateDTO({
        output: getVirtualWebsResponseScheme,
        input: null
    })
    async getVirtualWebs(skip?: number) {
        return await this.repositories.virtualWebRepository.findAll(skip)
    }

    @ValidateDTO({
        input: createVirtualWebScheme,
        output: createVirtualWebResponseScheme
    })
    async createVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO) {
        return await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })
    }

    @ValidateDTO({
        output: getVirtualWebDetailsResponseScheme,
        input: null
    })
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
