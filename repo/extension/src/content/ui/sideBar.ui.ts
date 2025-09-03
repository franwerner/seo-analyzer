import { ReferencesIssues } from "~/types/referencesIssues.type"
import global from "./global.ui";
import highlightIssue from "./highlightIssue.ui";




export default function sideBar(issues: ReferencesIssues): HTMLElement {
    const bar = document.createElement("div")
    bar.style.position = "fixed"
    bar.style.top = "0"
    bar.style.right = "0"
    bar.style.width = "300px"
    bar.style.height = "100%"
    bar.style.background = "#f8fafc"
    bar.style.borderLeft = "1px solid #e5e7eb"
    bar.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.1)"
    bar.style.padding = "12px"
    bar.style.overflowY = "auto"
    bar.style.zIndex = "9999"
    bar.style.fontFamily = "system-ui, sans-serif"
    bar.style.transition = "transform 0.3s ease"
    bar.style.transform = "translateX(0)"

    const title = document.createElement("h3")
    title.innerText = "SEO Issues"
    title.style.margin = "0 0 16px 0"
    title.style.fontSize = "18px"
    title.style.fontWeight = "600"
    title.style.color = "#111827"
    bar.appendChild(title)

    Object.entries(issues).forEach(([_, issue]) => {
        const btn = document.createElement("button")
        btn.innerHTML = `<span style="font-weight:500">${issue.tag}</span>
                     <span style="
                       background:#ef4444;
                       color:white;
                       border-radius:12px;
                       padding:2px 8px;
                       font-size:12px;
                       margin-left:8px;
                     ">${issue.messages.length}</span>`
        btn.style.display = "flex"
        btn.style.alignItems = "center"
        btn.style.justifyContent = "space-between"
        btn.style.width = "100%"
        btn.style.marginBottom = "8px"
        btn.style.padding = "10px"
        btn.style.border = "1px solid #e5e7eb"
        btn.style.borderRadius = "6px"
        btn.style.cursor = "pointer"
        btn.style.background = "#fff"
        btn.style.transition = "all 0.2s ease"

        btn.onmouseover = () => {
            if (!btn.classList.contains("active")) btn.style.background = "#f1f5f9"
        }
        btn.onmouseleave = () => {
            if (!btn.classList.contains("active")) btn.style.background = "#fff"
        }

        btn.onclick = () => highlightIssue(issue, btn)

        global.navButtons.set(issue.ref, btn)
        bar.appendChild(btn)
    })

    return bar
}