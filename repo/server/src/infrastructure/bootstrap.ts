import VirtualDomRepository from "@/application/repositories/VirtualDom.repository";
import VirtualDomAnalysisRepository from "@/application/repositories/VirtualDomAnalysis.repository";
import VirtualWebRepository from "@/application/repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "@/application/repositories/VirtualWebSummary.repository";
import VirtualDomManagerUseCase from "@/application/use-cases/VirtualDomManager.use-case";
import VirtualWebManagerUseCase from "@/application/use-cases/VirtualWebManager.use-case";
import VirtualWebStoredUseCase from "@/application/use-cases/VirtualWebStored.use-case";
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import { PrismaClient } from "@prisma/client";
import OpenAiService from "./AI/openAi.service";
import PuppeterService from "./scrapper/puppeter.service";
import VirtualDomStoredUseCase from "@/application/use-cases/virtualDomStored.use-case";

const openAiService = new OpenAiService()
const puppeterService = new PuppeterService()
const prisma = new PrismaClient()

const virtualWebStore = new VirtualWebStore(openAiService, puppeterService)

//#Repositorios
const virtualWebRepository = new VirtualWebRepository(prisma)
const virtualWebSummaryRepository = new VirtualWebSummaryRepository(prisma)
const virtualDomRepository = new VirtualDomRepository(prisma)
const virtualDomAnalysisRepository = new VirtualDomAnalysisRepository(prisma)

//#UseCases
const virtualWebManagerUseCase = new VirtualWebManagerUseCase(
    openAiService,
    virtualWebStore, {
    virtualWebRepository,
    virtualWebSummaryRepository,
})
const virtualDomManagerUseCase = new VirtualDomManagerUseCase(virtualWebManagerUseCase, {
    virtualDomRepository,
    virtualDomAnalysisRepository
});
const virtualWebStoredUseCase = new VirtualWebStoredUseCase(
    openAiService,
    {
        virtualWebRepository,
        virtualWebSummaryRepository
    })


const virtualDomStoredUseCase = new VirtualDomStoredUseCase({
    virtualDomRepository
})

prisma.$connect().then(() => console.log("Connected to database"))

export {
    openAiService,
    puppeterService, virtualDomManagerUseCase, virtualWebManagerUseCase, virtualWebStore,
    virtualWebStoredUseCase,
    virtualDomStoredUseCase
};

