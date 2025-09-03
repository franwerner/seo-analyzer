export default function toolTip(issue: { messages: string[] }): HTMLElement {
    const box = document.createElement("div")
    box.className = "issue-tooltip"
    box.style.position = "absolute"
    box.style.background = "#fff"
    box.style.border = "1px solid #dc2626"
    box.style.borderLeft = "4px solid #dc2626"
    box.style.borderRadius = "6px"
    box.style.padding = "10px"
    box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
    box.style.zIndex = "10001"
    box.style.maxWidth = "300px"
    box.style.fontFamily = "system-ui, sans-serif"
    box.style.fontSize = "14px"
    box.style.color = "#111"

    const ul = document.createElement("ul")
    ul.style.margin = "0"
    ul.style.padding = "0 0 0 20px"

    issue.messages.forEach((msg) => {
        const li = document.createElement("li")
        li.innerText = msg
        ul.appendChild(li)
    })

    box.appendChild(ul)
    return box
}