import VirtualDomRepository from "@/application/repositories/VirtualDom.repository"
import { VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import createVirtualPageScheme, { CreateVirtualPageDTO } from "../dtos/CreateVirtualPage.dto"
import ValidateDTO from "../decorators/ValidateDTO.decorator"
import VirtualWebManagerService from "./VirtualWebManager.use-case"

export default class VirtualPageManagerUseCase {
    constructor(
        private virtualWebManagerService: VirtualWebManagerService,
        private repositories: {
            virtualDomRepository: VirtualDomRepository,
        }
    ) { }

    async getVirtualPageOrThrow({ virtualWebId, virtualDomId }: { virtualWebId: number, virtualDomId: number }) {
        const virtualWeb = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        return virtualWeb.vdomStore.getOrCreate(virtualDomId, async (create) => {
            const virtualDom = await this.repositories.virtualDomRepository.findUnique(virtualDomId)
            if (!virtualDom) throw new VirtualDomNotFountError()
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
    }

    @ValidateDTO(createVirtualPageScheme)
    async registerVirtualPage({
        virtualWebId,
        pathname
    }: CreateVirtualPageDTO) {
        const virtualDom = await this.repositories.virtualDomRepository.create({
            virtualWebId,
            pathname,
        })
        const virtualWeb = await this.virtualWebManagerService.getVirtualWebOrThrow(virtualWebId)
        return virtualWeb.vdomStore.getOrCreate(virtualDom.id, async (create) => {
            return create({
                id: virtualDom.id,
                pathname: virtualDom.pathname
            })
        })
    }

}