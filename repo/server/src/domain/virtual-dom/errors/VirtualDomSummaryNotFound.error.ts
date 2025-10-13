import { CustomError } from "@/global-shared/errors/Custom.error";

export default class VirtualDomSummaryNotFound extends CustomError {
    constructor() {
        super({
            name: "VirtualDomSummaryNotFound",
            message: "Virtual Dom Summary Not Found",
        })
    }
}