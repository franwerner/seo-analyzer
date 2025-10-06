import { Issue } from "@/infrastructure/schemas/issue.schema";
import { Tokens } from "@/infrastructure/schemas/tokens.schema";

export interface Validation {
    issues: Array<Issue>,
    tokens: Tokens
}