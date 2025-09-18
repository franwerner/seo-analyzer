import { Issue } from "./Issue.interface";
import { Tokens } from "./Tokens.interface";

export interface Validation {
    issues: Array<Issue>,
    tokens?: Tokens
}