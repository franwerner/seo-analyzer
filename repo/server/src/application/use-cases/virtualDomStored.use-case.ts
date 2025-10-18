import VirtualDomRepository from "../repositories/VirtualDom.repository";
import { CreateVirtualDomDTO, createVirtualDomResponseScheme, createVirtualDomScheme, getVirtualDomsResponseScheme, } from "@seo-analyzer/common"
import ValidateDTO from "../shared/decorators/ValidateDTO.decorator";
export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository
        }
    ) { }

    @ValidateDTO(createVirtualDomScheme)
    async createVirtualDom(data: CreateVirtualDomDTO) {
        const result = await this.repositories.virtualDomRepository.create({
            virtualWebId: data.virtualWebId,
            pathname: data.pathname,
        })
        return createVirtualDomResponseScheme.parse(result)
    }

    async getVirtualDoms(props: { virtualWebId: number, skip: number }) {
        const result = await this.repositories.virtualDomRepository.findAllByVirtualWeb(props)
        return getVirtualDomsResponseScheme.parse(result)
    }
}