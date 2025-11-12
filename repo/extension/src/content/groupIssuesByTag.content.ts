import { AnalysisIssue } from "@seo-analyzer/common"
import { GroupIssuesByTag } from "~/types/groupIssuesByTag"

export default function groupIssuesByTag(response: AnalysisIssue[]) {
    /**
     * TODO: Esto realmente se deberia agrupar con una consulta de la base de datos.
     * No afecta en nada, pero no es apropiado se deberia aprovechar el motor de consultas.
     */
    return Object.groupBy(response, ({ tag }) => tag.toLowerCase()) as GroupIssuesByTag
}