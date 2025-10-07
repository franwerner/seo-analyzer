import { CustomError } from "@/shared/errors/Custom.error";

export default class VirtualDomAnalysisInProgressError extends CustomError {
    constructor() {
        super({
            message: "The virtual DOM is being analyzed, one request at a time",
            name: "VirtualDomAnalysisInProgressError"
        })
    }
}