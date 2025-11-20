import DTOError from "@/application/shared/errors/DTO.error"
import { VirtualDomAnalysisError, VirtualDomGeneratedSnapshotError, VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import { VirtualWebAlreadyExistsError, VirtualWebNotFountError } from "@/domain/virtual-web/errors"
import VirtualWebConfigNotFountError from "@/domain/virtual-web/errors/VirtualWebConfigNotFount.error"
import EnvNotFountError from "@/infrastructure/errors/EnvNotFount.error"
import HTMLNotFountError from "@/infrastructure/errors/HTMLNotFount.error"
import MaxPageActiveError from "@/infrastructure/errors/MaxPageActive.error"

const HTTPErrorMap = {
    [HTMLNotFountError.name]: 404,
    [VirtualDomAnalysisError.name]: 400,
    [VirtualDomGeneratedSnapshotError.name]: 409,
    [VirtualDomNotFountError.name]: 404,
    [VirtualWebAlreadyExistsError.name]: 409,
    [VirtualWebNotFountError.name]: 404,
    [VirtualWebConfigNotFountError.name]: 404,
    [EnvNotFountError.name]: 404,
    [MaxPageActiveError.name]: 409,
    [DTOError.name]: 400,
}

export default HTTPErrorMap