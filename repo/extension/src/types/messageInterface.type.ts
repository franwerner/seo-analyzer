import { AnalysisIssue } from "@seo-analyzer/common";

export type MessageInterface = {
    action: string,
    res: {
        data: AnalysisIssue[],
        ok: boolean
    }
}