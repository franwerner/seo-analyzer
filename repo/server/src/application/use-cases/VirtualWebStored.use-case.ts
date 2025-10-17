import { CreateVirtualWebDTO, createVirtualWebResponseScheme, createVirtualWebScheme, getVirtualWebDetailsResponseScheme, getVirtualWebsResponseScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import OpenAiService from "@/infrastructure/AI/openAi.service";
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator";
import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";

export default class VirtualWebStoredUseCase {

    constructor(
        private AiService: OpenAiService,
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    async getVirtualWebs(skip?: number) {
        const virtualWebs = await this.repositories.virtualWebRepository.findAll(skip)
        return getVirtualWebsResponseScheme.parse(virtualWebs)
    }

    @ValidateDTO(createVirtualWebScheme)
    async createVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO) {
        const res = await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })

        return createVirtualWebResponseScheme.parse(res)
    }

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

        const analysisUsage = this.AiService.calculateUsageTokens(analysisUsageWithoutTotal)
        const summaryUsage = this.AiService.calculateUsageTokens(summaryUsageWithoutTotal)
        if (!virtualWeb) {
            throw new VirtualWebNotFound()
        }
        return getVirtualWebDetailsResponseScheme.parse({
            ...virtualWeb,
            analysisUsage,
            summaryUsage,
        })
    }

}
