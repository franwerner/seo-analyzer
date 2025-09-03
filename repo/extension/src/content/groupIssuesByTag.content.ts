import { AnalyzeInterface } from "~/types/analyzeInterface.type"
import { GroupIssuesByTag } from "~/types/groupIssuesByTag"

export default function groupIssuesByTag(response: AnalyzeInterface) {
    const lastElement = response
    if (!lastElement) throw new Error("No se encontro el ultimo elemento")
    if (!Array.isArray(lastElement.issues)) throw new Error("El  ultimo no tiene issues")
    return Object.groupBy(lastElement.issues, ({ tag }) => tag.toLowerCase()) as GroupIssuesByTag
}