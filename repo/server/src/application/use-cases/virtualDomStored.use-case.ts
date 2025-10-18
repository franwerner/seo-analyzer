import { CreateVirtualDomDTO, createVirtualDomScheme, getVirtualDomsScheme } from "@seo-analyzer/common";
import VirtualDomRepository from "../repositories/VirtualDom.repository";
import ValidateDTO from "../shared/decorators/validateDTO.decorator";
export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository
        }
    ) { }

    @ValidateDTO(createVirtualDomScheme)
    async createVirtualDom(data: CreateVirtualDomDTO["input"]) {
        return await this.repositories.virtualDomRepository.create({
            virtualWebId: data.virtualWebId,
            pathname: data.pathname,
        })
    }

    @ValidateDTO(getVirtualDomsScheme)
    async getVirtualDoms(props: { virtualWebId: number, skip: number }) {
        return await this.repositories.virtualDomRepository.findAllByVirtualWeb(props)
    }
}