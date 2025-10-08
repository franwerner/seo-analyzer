import { CustomError } from "@/shared/errors/Custom.error";

export default class VirtualDomGeneratedSnapshotError extends CustomError {
    constructor(error: any) {
        super({
            message: `The virtual DOM snapshot could not be generated - ${error?.message}`,
            name: "VirtualDomGeneratedSnapshotError"
        })
    }
}