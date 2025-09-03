import { AnalyzeInterface } from "./analyzeInterface.type";

export type MessageInterface = {
    action: string,
    res: {
        data: AnalyzeInterface,
        ok: boolean
    }
}