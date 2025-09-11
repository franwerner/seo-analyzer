import type { Issue } from "./IssueInterface.type";

interface SeoDetails {
    issues: Issue[];
    tokens: {
        input: number;
        output: number;
    }
}

export type { SeoDetails }