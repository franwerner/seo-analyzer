import { Usage } from "@seo-analyzer/common";
import { Issue } from "../types/Issue.interface";

export interface Validation {
    issues: Array<Issue>,
    usage: Usage
}