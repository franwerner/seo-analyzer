import VirtualWebNotFound from "@/domain/virtual-web/errors/VirtualWebNotFount.error";
import { CreateVirtualWebDTO, createVirtualWebScheme, getVirtualWebDetailsScheme, getVirtualWebsScheme } from "@seo-analyzer/common";
import VirtualWebRepository from "../repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "../repositories/VirtualWebSummary.repository";

export default class VirtualWebStoredUseCase {

    constructor(
        private repositories: {
            virtualWebRepository: VirtualWebRepository
            virtualWebSummaryRepository: VirtualWebSummaryRepository
        }
    ) { }

    async getVirtualWebs(skip?: number) {
        return await this.repositories.virtualWebRepository.findAll(skip)
    }

    async createVirtualWeb({
        host,
        mainPathname
    }: CreateVirtualWebDTO["input"]) {
        return await this.repositories.virtualWebRepository.createVirtualWebAggregate({
            host,
            mainPathname
        })
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
