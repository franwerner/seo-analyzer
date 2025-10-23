import { ValidationTypeEnum } from "@/schemes";

export type AnalysisIssue = {
    id: number;
    virtualDomAnalysisId: number;
    tag: string;
    message: string;
    type: ValidationTypeEnum
    traceIds: string[];
}