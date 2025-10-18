import { CustomError } from "@/global-shared/errors/Custom.error";

export default class OutputDTOError extends CustomError {
    constructor(cause?: unknown) {
        super({
            name: 'OutputDTOError',
            message: 'Failed to send or process output data',
        }, cause)
    }
}