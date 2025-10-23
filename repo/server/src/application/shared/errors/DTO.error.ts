import { CustomError } from "@/global-shared/errors/Custom.error";

export default class DTOError extends CustomError {
    constructor(cause?: unknown) {
        super({
            name: 'DTOError',
            message: 'Failed to process incoming data due to invalid format or content',
        }, cause)
    }
}