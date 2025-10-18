import { CustomError } from "@/global-shared/errors/Custom.error";

export default class InputDTOError extends CustomError {
    constructor(cause?: unknown) {
        super({
            name: 'InputDTOError',
            message: 'Failed to process incoming data due to invalid format or content',
        }, cause)
    }
}