import VirtualDomRepository from "../repositories/VirtualDom.repository";
import { CreateVirtualDomDTO, createVirtualDomResponseScheme, createVirtualDomScheme, getVirtualDomsResponseScheme, } from "@seo-analyzer/common"
import ValidateDTO from "../shared/decorators/validateDTO.decorator";
export default class VirtualDomStoredUseCase {

    constructor(
        private repositories: {
            virtualDomRepository: VirtualDomRepository
        }
    ) { }

    @ValidateDTO({
        input: createVirtualDomScheme,
        output: createVirtualDomResponseScheme
    })
    async createVirtualDom(data: CreateVirtualDomDTO) {
        return await this.repositories.virtualDomRepository.create({
            virtualWebId: data.virtualWebId,
            pathname: data.pathname,
        })
    }

    @ValidateDTO({
        output: getVirtualDomsResponseScheme,
        input: null
    })
    async getVirtualDoms(props: { virtualWebId: number, skip: number }) {
        return await this.repositories.virtualDomRepository.findAllByVirtualWeb(props)
    }
}