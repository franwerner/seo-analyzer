import { Issue } from "../types/Issue.interface";
import { Tokens } from "../types/Tokens.interface";

export interface Validation {
    issues: Array<Issue>,
    tokens: Tokens
}