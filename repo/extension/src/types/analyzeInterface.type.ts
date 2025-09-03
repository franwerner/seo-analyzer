import { Issues } from "./issues.type"


export interface AnalyzeInterface {
    issues: Array<Issues>
    feedback: string[]
    tokens: { input: number, output: number }
}
