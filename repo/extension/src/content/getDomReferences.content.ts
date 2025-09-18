import crc32 from "crc-32";
import { GroupIssuesByTag } from "~/types/groupIssuesByTag";
import { Issues } from "~/types/issues.type";
import { ReferencesIssues } from "~/types/referencesIssues.type";


function setIssuesInStore(
    node: HTMLElement,
    issues: Array<Issues>,
    storeIssuesByTraceId: ReferencesIssues,
    pathDom: string
) {

    const nodeName = node.nodeName.toLowerCase()

    const traceIdGeneratedByElement = crc32.str(pathDom)

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

    const tree = (elem: HTMLElement = html, pathDom = html.nodeName) => {

        if (elem.hasChildNodes()) {
            for (let i = 0; i < elem.childNodes.length; i++) {
                const child = elem.childNodes[i]
                if (!["STYLE", "#comment", "svg", "NOSCRIPT", "#text"].includes(child.nodeName)) {
                    tree(child as HTMLElement, pathDom + "/" + child.nodeName + "/" + i)
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
