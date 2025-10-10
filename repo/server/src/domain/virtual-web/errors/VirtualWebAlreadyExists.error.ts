import { CustomError } from "@/global-shared/errors/Custom.error";

export default class VirtualWebAlreadyExists extends CustomError {
    constructor() {
        super({
            name: "VirtualWebAlreadyExists",
            message: "Virtual Web Already Exists",
        })
    }
}