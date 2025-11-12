import { AnalysisIssue } from "@seo-analyzer/common";
import crc32 from "crc-32";
import { GroupIssuesByTag } from "~/types/groupIssuesByTag";
import { ReferencesIssues } from "~/types/referencesIssues.type";


function setIssuesInStore(
    node: HTMLElement,
    issues: AnalysisIssue[],
    storeIssuesByTraceId: ReferencesIssues,
    forHash: string
) {

    const nodeName = node.nodeName.toLowerCase()

    const traceIdGeneratedByElement = crc32.str(forHash).toString()


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

        const filteredChildNodes = Array.from(elem.childNodes).filter(child => (child.nodeType == 1 && !["style", "#comment", "svg", "noscript"].includes(child.nodeName.toLocaleLowerCase())) || child.nodeType == 3)
        if (filteredChildNodes.length > 0) {
            for (let i = 0; i < filteredChildNodes.length; i++) {
                const child = filteredChildNodes[i]
                const childPathDom = pathDom + "/" + child.nodeName.toLocaleLowerCase() + "/" + i
                tree(child as HTMLElement, childPathDom)
            }
        }
        const nodeName = elem.nodeName.toLowerCase()
        if (!(nodeName in issuesForElement)) return
        const forHash = pathDom
        setIssuesInStore(elem, issuesForElement[nodeName], storeIssuesByTraceId, forHash)

    }
    tree()
    Object.values(issuesForElement).forEach(issue => {
        issue.forEach(({ traceIds }) => {
            traceIds.forEach(traceId => {
                if (!(traceId in storeIssuesByTraceId)) {
                    console.log(traceId)
                }
            })
        })
    })
    return storeIssuesByTraceId
}
