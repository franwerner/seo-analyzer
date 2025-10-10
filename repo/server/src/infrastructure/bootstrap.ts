import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import OpenAi from "./AI/openAi.service";
import PuppeterService from "./scrapper/puppeter.service";
import { PrismaClient } from "@prisma/client";
import VirtualWebUseCases from "@/application/virtual-web/use-cases/virtualWeb.use-cases";

const IA = new OpenAi()
const scrapper = new PuppeterService()
const prisma = new PrismaClient()
const virtualWebStore = new VirtualWebStore(IA, scrapper)
const virtualWebUseCases = new VirtualWebUseCases(virtualWebStore)


prisma.$connect().then(() => console.log("Connected to database"))

export {
    IA,
    scrapper,
    virtualWebStore,
    virtualWebUseCases,
}