import { CustomError } from "@/global-shared/errors/Custom.error";

export default class VirtualWebConfigNotFountError extends CustomError {
    constructor() {
        super({
            name: "VirtualWebConfigNotFountError",
            message: "Virtual Web Config Not Found",
        })
    }
}
