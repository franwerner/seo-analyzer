import { ReferencesIssues } from "~/types/referencesIssues.type"
import global from "./global.ui";
import highlightIssue from "./highlightIssue.ui";

export default function sideBar(issues: ReferencesIssues): HTMLElement {
    const bar = document.createElement("div")
    bar.style.position = "fixed"
    bar.style.top = "0"
    bar.style.right = "0"
    bar.style.width = "320px"
    bar.style.height = "100%"
    bar.style.background = "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
    bar.style.borderLeft = "1px solid #e5e7eb"
    bar.style.boxShadow = "-4px 0 16px rgba(0,0,0,0.12)"
    bar.style.overflowY = "auto"
    bar.style.zIndex = "9999"
    bar.style.fontFamily = "system-ui, -apple-system, sans-serif"
    bar.style.transition = "transform 0.3s ease"
    bar.style.transform = "translateX(0)"
    bar.style.display = "flex"
    bar.style.flexDirection = "column"

    // Header
    const header = document.createElement("div")
    header.style.padding = "16px"
    header.style.borderBottom = "1px solid #e5e7eb"
    header.style.background = "#ffffff"
    header.style.position = "sticky"
    header.style.top = "0"
    header.style.zIndex = "10"

    const titleRow = document.createElement("div")
    titleRow.style.display = "flex"
    titleRow.style.alignItems = "center"
    titleRow.style.justifyContent = "space-between"

    const title = document.createElement("h3")
    title.innerText = "SEO Issues"
    title.style.margin = "0"
    title.style.fontSize = "20px"
    title.style.fontWeight = "700"
    title.style.color = "#111827"

    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = "✕"
    closeBtn.style.border = "none"
    closeBtn.style.background = "transparent"
    closeBtn.style.fontSize = "20px"
    closeBtn.style.cursor = "pointer"
    closeBtn.style.color = "#6b7280"
    closeBtn.style.padding = "4px 8px"
    closeBtn.style.borderRadius = "4px"
    closeBtn.style.transition = "all 0.2s ease"
    closeBtn.onmouseover = () => {
        closeBtn.style.background = "#f3f4f6"
        closeBtn.style.color = "#111827"
    }
    closeBtn.onmouseleave = () => {
        closeBtn.style.background = "transparent"
        closeBtn.style.color = "#6b7280"
    }
    closeBtn.onclick = () => {
        bar.style.transform = "translateX(100%)"
        setTimeout(() => bar.remove(), 300)
    }

    titleRow.appendChild(title)
    titleRow.appendChild(closeBtn)

    const issueCount = Object.keys(issues).length
    const totalIssues = Object.values(issues).reduce((sum, issue) => sum + issue.messages.length, 0)
    const subtitle = document.createElement("p")
    subtitle.innerText = `${issueCount} elements with ${totalIssues} problem${totalIssues !== 1 ? 's' : ''}`
    subtitle.style.margin = "8px 0 0 0"
    subtitle.style.fontSize = "13px"
    subtitle.style.color = "#6b7280"
    subtitle.style.fontWeight = "500"

    header.appendChild(titleRow)
    header.appendChild(subtitle)
    bar.appendChild(header)

    // Content container
    const content = document.createElement("div")
    content.style.padding = "12px"
    content.style.flex = "1"
    content.style.overflowY = "auto"

    Object.entries(issues).forEach(([_, issue]) => {
        const btn = document.createElement("button")

        const leftContent = document.createElement("div")
        leftContent.style.display = "flex"
        leftContent.style.flexDirection = "column"
        leftContent.style.alignItems = "flex-start"
        leftContent.style.gap = "4px"
        leftContent.style.flex = "1"

        const tagName = document.createElement("span")
        tagName.innerText = issue.tag
        tagName.style.fontWeight = "600"
        tagName.style.fontSize = "14px"
        tagName.style.color = "#111827"

        const issuePreview = document.createElement("span")
        issuePreview.innerText = issue.messages[0] || "Sin descripción"
        issuePreview.style.fontSize = "12px"
        issuePreview.style.color = "#6b7280"
        issuePreview.style.textAlign = "left"
        issuePreview.style.overflow = "hidden"
        issuePreview.style.textOverflow = "ellipsis"
        issuePreview.style.whiteSpace = "nowrap"
        issuePreview.style.maxWidth = "200px"

        leftContent.appendChild(tagName)
        leftContent.appendChild(issuePreview)

        const badge = document.createElement("span")
        badge.innerText = issue.messages.length.toString()
        badge.style.background = "#ef4444"
        badge.style.color = "white"
        badge.style.borderRadius = "12px"
        badge.style.padding = "4px 10px"
        badge.style.fontSize = "12px"
        badge.style.fontWeight = "600"
        badge.style.minWidth = "24px"
        badge.style.textAlign = "center"

        btn.appendChild(leftContent)
        btn.appendChild(badge)

        btn.style.display = "flex"
        btn.style.alignItems = "center"
        btn.style.justifyContent = "space-between"
        btn.style.width = "100%"
        btn.style.marginBottom = "8px"
        btn.style.padding = "12px"
        btn.style.border = "1px solid #e5e7eb"
        btn.style.borderRadius = "8px"
        btn.style.cursor = "pointer"
        btn.style.background = "#fff"
        btn.style.outline = "none"
        btn.style.transition = "all 0.2s ease"
        btn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"
        btn.style.position = "relative"

        let hoverTooltip: HTMLElement | null = null

        btn.onclick = () => {
            // Remove hover tooltip before showing the main one
            if (hoverTooltip) {
                hoverTooltip.remove()
                hoverTooltip = null
            }
            highlightIssue(issue, btn)
        }



        issue.ref.style.outline = "2px dashed #1d4ed8"
        issue.ref.style.outlineOffset = "2px"
        issue.ref.setAttribute("data-issue", "true")
        issue.ref.onmouseenter = () => {
            if (hoverTooltip) {
                hoverTooltip.remove()
                hoverTooltip = null
            }
            btn.focus()
            highlightIssue(issue, btn, false)
        }


        global.navButtons.set(issue.ref, btn)
        content.appendChild(btn)
    })

    bar.appendChild(content)
    return bar
}