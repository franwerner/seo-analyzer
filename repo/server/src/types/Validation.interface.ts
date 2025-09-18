import { Issues } from "../schemas/issues.schema";

export interface Validation {
    issues: Issues,
    tokens: { input: number, output: number }
}