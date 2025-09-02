




function getIssuesElements() {
    console.log("getIssuesElements");
    const currentUrl = document.URL;
    return new Promise((resolve, reject) => {
        function handleMessage(message, sender, sendResponse) {
            console.log("message")
            if (message.action === "analyzeResult") {
                chrome.runtime.onMessage.removeListener(handleMessage);
                if (message.error) {
                    reject([]);
                } else {
                    resolve(message.data);
                }
            }
        }
        chrome.runtime.onMessage.addListener(handleMessage);
        chrome.runtime.sendMessage({ url: currentUrl, action: "analyze" });
    })
}

function analyze(issuesForElement = {}) {

    const issuesElements = {}

    const html = document.children[0]

    const recursive = (elem = html, pathDom = html.nodeName) => {

        const nodeName = elem.nodeName.toLowerCase()

        if (nodeName in issuesForElement) {
            const issues = issuesForElement[nodeName];

            for (let i = 0; i < issues.length; i++) {
                const issue = issues[i];
                const match = issue.traceIds.some(
                    traceId => traceId == CRC32.str(pathDom)
                );

                //Se deberian agrupar la salida  => {message: issue.message, elements : Array<ref elem>}
                //Esa agrupacion se dara en base a la posicion de I de donde se encuentre el error de una etiqueta en especifico.


            }


        }
        if (elem.hasChildNodes()) {
            for (let i = 0; i < elem.childNodes.length; i++) {
                const child = elem.childNodes[i]
                if (!["SCRIPT", "STYLE", "#comment", "svg", "LINK", "#text"].includes(child.nodeName)) {
                    recursive(child, pathDom + "/" + child.nodeName + "/" + i)
                }
            }

        }

    }
    recursive()

    console.log(issuesElements)

    return issuesElements
}

window.contentVar = {
    getIssuesElements,
    analyze
}