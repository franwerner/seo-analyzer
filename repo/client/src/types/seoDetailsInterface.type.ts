import type { Issue } from "./IssueInterface.type";

interface SeoDetails {
    issues: Issue[];
    feedback: string[];
    tokens: {
        input: number;
        output: number;
    }
}

export type { SeoDetails }