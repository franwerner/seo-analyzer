import VirtualWebStore from "@/domain/virtual-web/store/virtualWeb.store";
import OpenAi from "./AI/openAi.service";
import PuppeterService from "./scrapper/puppeter.service";
import VirtualWebUseCases from "@/application/use-cases/virtualWeb.use-cases";
import VirtualDomUseCases from "@/application/use-cases/virtualDom.use-cases";

const IA = new OpenAi()
const scrapper = new PuppeterService()
const virtualWebStore = new VirtualWebStore(IA, scrapper)
const virtualWebUseCases = new VirtualWebUseCases(virtualWebStore)
const virtualDomUseCases = new VirtualDomUseCases()

export {
    IA,
    scrapper,
    virtualWebStore,
    virtualWebUseCases,
    virtualDomUseCases,
}