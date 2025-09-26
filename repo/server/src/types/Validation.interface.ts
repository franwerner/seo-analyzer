import { Issue } from "@/schemas/issues.schema";
import { Tokens } from "./Tokens.interface";

export interface Validation {
    issues: Array<Issue>,
    tokens?: Tokens
}