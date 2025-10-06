import { MessageInterface } from "~/types/messageInterface.type";
import groupIssuesByTag from "./groupIssuesByTag.content";
import getDomReferences from "./getDomReferences.content";
import injectUi from "./ui/inject.ui";


function onAnalyzeResponse() {
    function handleMessage(message: MessageInterface) {
        if (message.action !== "getIssues" || !message.res.ok) return
        const groupByTag = groupIssuesByTag(message.res.data)
        const issuesElements = getDomReferences(groupByTag)
        console.log(issuesElements)
        let sum = 0
        for (const key in issuesElements) {
            sum += issuesElements[key].messages.length
        }
        console.log(sum)
        injectUi(issuesElements)
    }
    chrome.runtime.onMessage.addListener(handleMessage)
}
onAnalyzeResponse()
