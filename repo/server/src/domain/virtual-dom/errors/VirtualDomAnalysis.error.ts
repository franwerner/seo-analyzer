import { CustomError } from "@/global-shared/errors/Custom.error";

export default class VirtualDomAnalysisError extends CustomError {
    constructor(error?: any) {
        super({
            message: `Error analyzing virtual DOM - ${error?.message}`,
            name: "VirtualDomAnalysisError"
        }, error)
    }
}