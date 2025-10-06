import { z } from "zod"

const issueType = z.enum(["schema", "semantic", "spelling", "general", "resource", "structure"]);

export enum IssueType {
    SCHEMA = "schema",
    SEMANTIC = "semantic",
    SPELLING = "spelling",
    GENERAL = "general",
    RESOURCE = "resource",
    STRUCTURE = "structure"
}
export default issueType