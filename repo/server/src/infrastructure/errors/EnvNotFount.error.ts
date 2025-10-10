import { CustomError } from "@/global-shared/errors/Custom.error";

export default class EnvNotFountError extends CustomError {
    constructor() {
        super({
            message: "Environment variable not found",
            name: "EnvNotFountError"
        })
    }
}