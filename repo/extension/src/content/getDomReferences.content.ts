import { AnalysisIssue } from "@seo-analyzer/common";
import crc32 from "crc-32";
import { GroupIssuesByTag } from "~/types/groupIssuesByTag";
import { ReferencesIssues } from "~/types/referencesIssues.type";


function setIssuesInStore(
    node: HTMLElement,
    issues: AnalysisIssue[],
    storeIssuesByTraceId: ReferencesIssues,
    pathDom: string
) {

    const nodeName = node.nodeName.toLowerCase()

    const traceIdGeneratedByElement = crc32.str(pathDom).toString()


    for (const issue of issues) {

        const match = issue.traceIds.some(traceId => traceId == traceIdGeneratedByElement)


        if (!match) continue

        if (!storeIssuesByTraceId[traceIdGeneratedByElement]) {
            storeIssuesByTraceId[traceIdGeneratedByElement] = {
                ref: node,
                messages: [issue.message],
                tag: nodeName
            }
        } else {
            storeIssuesByTraceId[traceIdGeneratedByElement].messages.push(issue.message)
        }
    }
}

export default function getDomReferences(issuesForElement: GroupIssuesByTag) {

    const storeIssuesByTraceId: ReferencesIssues = {}

    const html = document.children[0] as HTMLElement

    const tree = (elem: HTMLElement = html, pathDom = html.nodeName.toLowerCase()) => {

        if (elem.hasChildNodes()) {
            for (let i = 0; i < elem.childNodes.length; i++) {
                const child = elem.childNodes[i]
                if (!["style", "#comment", "svg", "noscript", "#text"].includes(child.nodeName.toLocaleLowerCase())) {
                    const childPathDom = pathDom + "/" + child.nodeName.toLocaleLowerCase() + "/" + i
                    tree(child as HTMLElement, childPathDom)
                }
            }
        }
        const nodeName = elem.nodeName.toLowerCase()
        if (!(nodeName in issuesForElement)) return
        setIssuesInStore(elem, issuesForElement[nodeName], storeIssuesByTraceId, pathDom)

    }
    tree()
    return storeIssuesByTraceId
}
