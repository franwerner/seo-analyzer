import VirtualDomRepository from "@/application/repositories/VirtualDom.repository";
import VirtualWebRepository from "@/application/repositories/VirtualWeb.repository";
import VirtualWebSummaryRepository from "@/application/repositories/VirtualDomSummary.repository";
import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import VirtualWebManagerUseCase from "@/application/use-cases/VirtualWebManager.use-case";
import { PrismaClient } from "@prisma/client";
import OpenAi from "./AI/openAi.service";
import PuppeterService from "./scrapper/puppeter.service";
import VirtualPageManagerUseCase from "@/application/use-cases/VirtualPageManager.use-case";
import VirtualDomSummaryRepository from "@/application/repositories/VirtualDomSummary.repository";
import VirtualDomAnalysisRepository from "@/application/repositories/VirtualDomAnalysis.repository";


const IA = new OpenAi()
const scrapper = new PuppeterService()
const prisma = new PrismaClient()

const virtualWebStore = new VirtualWebStore(IA, scrapper)

//#Repositorios
const virtualWebRepository = new VirtualWebRepository(prisma)
const virtualDomSummaryRepository = new VirtualDomSummaryRepository(prisma)
const virtualDomRepository = new VirtualDomRepository(prisma)
const virtualDomAnalysisRepository = new VirtualDomAnalysisRepository(prisma)

//#UseCases



const virtualWebManagerUseCase = new VirtualWebManagerUseCase(virtualWebStore, {
    virtualWebRepository,
    virtualDomSummaryRepository,
})
const virtualPageManagerUseCase = new VirtualPageManagerUseCase(virtualWebManagerUseCase, {
    virtualDomRepository,
    virtualDomAnalysisRepository
});


prisma.$connect().then(() => console.log("Connected to database"))

export {
    IA,
    scrapper,
    virtualWebManagerUseCase, virtualPageManagerUseCase, virtualWebStore
};

