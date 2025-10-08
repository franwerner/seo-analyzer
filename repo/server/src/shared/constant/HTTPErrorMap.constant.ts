import { HTMLNotFountError, VirtualDomAnalysisError, VirtualDomAnalysisInProgressError, VirtualDomGeneratedSnapshotError, VirtualDomNotFountError } from "@/domain/virtual-dom/errors"
import { VirtualWebAlreadyExistsError, VirtualWebNotFountError } from "@/domain/virtual-web/errors"

const HTTPErrorMap = {
    [HTMLNotFountError.name]: 404,
    [VirtualDomAnalysisError.name]: 400,
    [VirtualDomAnalysisInProgressError.name]: 409,
    [VirtualDomGeneratedSnapshotError.name]: 409,
    [VirtualDomNotFountError.name]: 404,
    [VirtualWebAlreadyExistsError.name]: 409,
    [VirtualWebNotFountError.name]: 404,
}

export default HTTPErrorMap