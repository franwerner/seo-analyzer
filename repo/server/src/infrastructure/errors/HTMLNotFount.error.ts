import { CustomError } from "@/global-shared/errors/Custom.error";

export default class HTMLNotFountError extends CustomError {
    constructor() {
        super({
            message: "HTML element not found",
            name: "HTMLNotFountError"
        })
    }
}