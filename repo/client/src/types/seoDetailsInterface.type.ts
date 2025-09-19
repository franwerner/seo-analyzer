import type { Issue } from "./IssueInterface.type";

interface SeoDetails {
    issues: Array<Issue>;
    tokens: {
        input: number;
        output: number;
    }
}

export type { SeoDetails }