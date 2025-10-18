import InputDTOError from "@/application/shared/errors/InputDTO.error"
import OutputDTOError from "@/application/shared/errors/OutputDTO.error"
import { HTMLNotFountError, VirtualDomAnalysisError, VirtualDomAnalysisInProgressError, VirtualDomGeneratedSnapshotError, VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import { VirtualWebAlreadyExistsError, VirtualWebNotFountError } from "@/domain/virtual-web/errors"
import VirtualWebConfigNotFountError from "@/domain/virtual-web/errors/VirtualWebConfigNotFount.error"
import EnvNotFountError from "@/infrastructure/errors/EnvNotFount.error"
import MaxPageActiveError from "@/infrastructure/errors/MaxPageActive.error"

const HTTPErrorMap = {
    [HTMLNotFountError.name]: 404,
    [VirtualDomAnalysisError.name]: 400,
    [VirtualDomAnalysisInProgressError.name]: 409,
    [VirtualDomGeneratedSnapshotError.name]: 409,
    [VirtualDomNotFountError.name]: 404,
    [VirtualWebAlreadyExistsError.name]: 409,
    [VirtualWebNotFountError.name]: 404,
    [VirtualWebConfigNotFountError.name]: 404,
    [EnvNotFountError.name]: 404,
    [MaxPageActiveError.name]: 409,
    [OutputDTOError.name]: 500,
    [InputDTOError.name]: 400,
}

export default HTTPErrorMap