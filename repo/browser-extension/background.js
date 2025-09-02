const btn = document.getElementById("btn-analyze")

chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "analyze") {
        fetch(`http://localhost:3000/validations?url=${msg.url}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => chrome.tabs.sendMessage(sender.tab.id, { action: "analyzeResult", data }))
            .catch(err => chrome.tabs.sendMessage(sender.tab.id, { action: "analyzeResult", data: { message: err.message } }));
        return false;
    }
});

btn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["exe.js"]
    })
})