import { Issues } from "./issues.type"


export interface AnalyzeInterface {
    issues: Array<Issues>
    tokens: { input: number, output: number }
}
