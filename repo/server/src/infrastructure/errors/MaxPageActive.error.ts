import { CustomError } from "@/global-shared/errors/Custom.error";

export default class MaxPageActiveError extends CustomError {
    constructor() {
        super({
            name: "MaxPageActiveError",
            message: "Max active pages reached."
        })
    }
}