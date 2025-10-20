import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import { CreateVirtualWebDTO, createVirtualWebScheme, getVirtualWebDetailsScheme, getVirtualWebsScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";
import { validateDTO } from "../shared/decorators/validateDTO.decorator";

export default class VirtualWebStoredUseCase {

    constructor(
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    @validateDTO(getVirtualWebsScheme)
    async getVirtualWebs(skip?: number) {
        return await this.repositories.virtualWebRepository.findAll(skip)
    }

    @validateDTO(createVirtualWebScheme)
    async createVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO["input"]) {
        return await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })
    }

    @validateDTO(getVirtualWebDetailsScheme)
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
