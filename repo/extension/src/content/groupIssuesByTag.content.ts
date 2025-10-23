import { AnalysisIssue } from "@seo-analyzer/common"
import { GroupIssuesByTag } from "~/types/groupIssuesByTag"

export default function groupIssuesByTag(response: AnalysisIssue[]) {
    return Object.groupBy(response, ({ tag }) => tag.toLowerCase()) as GroupIssuesByTag
}