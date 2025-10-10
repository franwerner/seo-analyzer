import { CustomError } from "@/global-shared/errors/Custom.error";

export default class VirtualDomNotFountError extends CustomError {
    constructor() {
        super({
            message: "VirtualDom not found",
            name: "VirtualDomNotFountError"
        })
    }
}