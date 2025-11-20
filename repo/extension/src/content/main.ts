import { AnalysisIssue, ApiResponse } from "@seo-analyzer/common";
import { IssuesGroupByElement } from "~/types/issuesGroupByElement.type";
import { getTracedHtml } from "../utils/htmlTracer";
import injectUi from "./ui/inject.ui";

function onAnalyzeResponse() {
    const mapDom = new Map<string, Element>()
    async function handleMessage(message: {
        action: string,
        response: ApiResponse.Success<{
            analysisIssues: AnalysisIssue[],
            analysisUsage: { input: number, output: number },
            issuesCount: number
        }>
    }, _sender: any, sendResponse: (response: any) => void) {

        if (message.action === "analyzePage") {
            const rest = getTracedHtml(mapDom);
            sendResponse(rest);
        } else if (message.action === "response") {
            const { analysisIssues, analysisUsage } = message.response.result
            const groupByElement: IssuesGroupByElement = new Map()
            for (const { traceIds, type, message } of analysisIssues) {
                for (const traceId of traceIds) {
                    const element = mapDom.get(traceId)
                    if (!element) continue
                    const get = groupByElement.get(element)
                    if (get) {
                        get.issues.push({ type, message })
                    } else {
                        groupByElement.set(element, {
                            issues: [{ type, message }]
                        })
                    }
                }
            }
            console.log(groupByElement)
            injectUi(groupByElement, analysisUsage, message.response.result.issuesCount)
        }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
}
onAnalyzeResponse()
