export default function toolTip(issue: { issues: { type: string; message: string }[] }): HTMLElement {
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
    ul.style.listStyle = "none"

    issue.issues.forEach(({ type, message }) => {
        const li = document.createElement("li")
        li.style.marginBottom = "8px"
        li.style.paddingLeft = "0"

        const typeSpan = document.createElement("span")
        typeSpan.innerText = type
        typeSpan.style.display = "inline-block"
        typeSpan.style.background = "#fef2f2"
        typeSpan.style.color = "#dc2626"
        typeSpan.style.padding = "2px 6px"
        typeSpan.style.borderRadius = "4px"
        typeSpan.style.fontSize = "11px"
        typeSpan.style.fontWeight = "600"
        typeSpan.style.marginBottom = "4px"
        typeSpan.style.textTransform = "uppercase"

        const msgSpan = document.createElement("span")
        msgSpan.innerText = message
        msgSpan.style.display = "block"
        msgSpan.style.fontSize = "13px"
        msgSpan.style.color = "#374151"

        li.appendChild(typeSpan)
        li.appendChild(msgSpan)
        ul.appendChild(li)
    })

    box.appendChild(ul)
    return box
}