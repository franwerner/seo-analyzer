import { MessageInterface } from "~/types/messageInterface.type";
import getDomReferences from "./getDomReferences.content";
import groupIssuesByTag from "./groupIssuesByTag.content";
import injectUi from "./ui/inject.ui";

function onAnalyzeResponse() {
    async function handleMessage(message: MessageInterface) {
        if (message.action !== "getIssues" || !message.res.ok) return
        const groupByTag = groupIssuesByTag(message.res.data)
        const issuesElements = getDomReferences(groupByTag)
        let sum = 0
        for (const key in issuesElements) {
            sum += issuesElements[key].messages.length
        }
        console.log(sum)
        console.log(issuesElements)
        injectUi(issuesElements)
    }
    chrome.runtime.onMessage.addListener(handleMessage)
}
onAnalyzeResponse()
