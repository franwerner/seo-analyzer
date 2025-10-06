import { CustomError } from "@/shared/errors/Custom.error";

export default class VirtualWebNotFound extends CustomError {
    constructor() {
        super({
            name: "VirtualWebNotFound",
            message: "Virtual Web Not Found",
        })
    }
}