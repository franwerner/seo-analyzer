import { AnalysisIssue } from "@/types/AnalysisIssue.interface";
import { Usage } from "@/types/Usage.interface";
import { VirtualDomAnalysis } from "@/types/VirtualDomAnalysis.interface";

export interface GetVirtualDomAnalysisDTO extends VirtualDomAnalysis {
    issuesCount: number,
    analysisUsage: Usage,
    analysisIssues: AnalysisIssue[]
}