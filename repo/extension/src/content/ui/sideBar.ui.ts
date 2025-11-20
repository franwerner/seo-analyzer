import { IssuesGroupByElement } from "~/types/issuesGroupByElement.type";
import global from "./global.ui";
import highlightIssue from "./highlightIssue.ui";
import { AnalysisUsage } from "./inject.ui";

export default function sideBar(issuesMap: IssuesGroupByElement, usage?: AnalysisUsage, issuesCount?: number): HTMLElement {
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
        toggleBtn.style.display = "flex"
    }

    // Toggle button to reopen sidebar
    const toggleBtn = document.createElement("button")
    toggleBtn.innerHTML = "◀"
    toggleBtn.style.position = "fixed"
    toggleBtn.style.top = "50%"
    toggleBtn.style.right = "0"
    toggleBtn.style.transform = "translateY(-50%)"
    toggleBtn.style.width = "32px"
    toggleBtn.style.height = "48px"
    toggleBtn.style.border = "none"
    toggleBtn.style.borderRadius = "8px 0 0 8px"
    toggleBtn.style.background = "#0ea5e9"
    toggleBtn.style.color = "white"
    toggleBtn.style.fontSize = "14px"
    toggleBtn.style.cursor = "pointer"
    toggleBtn.style.zIndex = "9998"
    toggleBtn.style.display = "none"
    toggleBtn.style.alignItems = "center"
    toggleBtn.style.justifyContent = "center"
    toggleBtn.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.15)"
    toggleBtn.style.transition = "all 0.2s ease"

    toggleBtn.onmouseover = () => {
        toggleBtn.style.background = "#0284c7"
        toggleBtn.style.width = "36px"
    }
    toggleBtn.onmouseleave = () => {
        toggleBtn.style.background = "#0ea5e9"
        toggleBtn.style.width = "32px"
    }

    toggleBtn.onclick = () => {
        bar.style.transform = "translateX(0)"
        toggleBtn.style.display = "none"
    }

    document.body.appendChild(toggleBtn)
    global.toggleBtn = toggleBtn

    titleRow.appendChild(title)
    titleRow.appendChild(closeBtn)

    const elementCount = issuesMap.size
    const totalIssues = issuesCount || 0

    const subtitle = document.createElement("p")
    subtitle.innerText = `${elementCount} element${elementCount !== 1 ? 's' : ''} with problems`
    subtitle.style.margin = "8px 0 0 0"
    subtitle.style.fontSize = "13px"
    subtitle.style.color = "#6b7280"
    subtitle.style.fontWeight = "500"

    const issuesInfo = document.createElement("p")
    issuesInfo.innerText = `${totalIssues} issue${totalIssues !== 1 ? 's' : ''} found`
    issuesInfo.style.margin = "4px 0 0 0"
    issuesInfo.style.fontSize = "12px"
    issuesInfo.style.color = "#9ca3af"
    issuesInfo.style.fontWeight = "400"

    header.appendChild(titleRow)
    header.appendChild(subtitle)
    header.appendChild(issuesInfo)

    // Usage info
    if (usage) {
        const usageContainer = document.createElement("div")
        usageContainer.style.marginTop = "8px"
        usageContainer.style.padding = "8px"
        usageContainer.style.background = "#f0f9ff"
        usageContainer.style.borderRadius = "6px"
        usageContainer.style.border = "1px solid #7dd3fc"

        const usageTitle = document.createElement("span")
        usageTitle.innerText = "Token Usage"
        usageTitle.style.fontSize = "11px"
        usageTitle.style.fontWeight = "600"
        usageTitle.style.color = "#0c4a6e"
        usageTitle.style.display = "block"
        usageTitle.style.marginBottom = "4px"

        const usageDetails = document.createElement("div")
        usageDetails.style.display = "flex"
        usageDetails.style.justifyContent = "space-between"
        usageDetails.style.fontSize = "12px"
        usageDetails.style.color = "#0369a1"

        const inputSpan = document.createElement("span")
        inputSpan.innerText = `In: ${usage.input.toLocaleString()}`

        const outputSpan = document.createElement("span")
        outputSpan.innerText = `Out: ${usage.output.toLocaleString()}`

        const totalSpan = document.createElement("span")
        totalSpan.innerText = `Total: ${(usage.input + usage.output).toLocaleString()}`
        totalSpan.style.fontWeight = "600"

        usageDetails.appendChild(inputSpan)
        usageDetails.appendChild(outputSpan)
        usageDetails.appendChild(totalSpan)

        usageContainer.appendChild(usageTitle)
        usageContainer.appendChild(usageDetails)
        header.appendChild(usageContainer)
    }

    bar.appendChild(header)

    // Content container
    const content = document.createElement("div")
    content.style.padding = "12px"
    content.style.flex = "1"
    content.style.overflowY = "auto"

    // Show message if no issues found or issues without elements
    if (issuesMap.size === 0) {
        const noIssues = document.createElement("div")
        noIssues.style.display = "flex"
        noIssues.style.flexDirection = "column"
        noIssues.style.alignItems = "center"
        noIssues.style.justifyContent = "center"
        noIssues.style.padding = "32px 16px"
        noIssues.style.textAlign = "center"

        const icon = document.createElement("div")
        const message = document.createElement("p")
        const subMessage = document.createElement("p")

        if (totalIssues > 0) {
            // Issues exist but no associated elements
            icon.innerText = "⚠"
            icon.style.fontSize = "48px"
            icon.style.color = "#f59e0b"
            icon.style.marginBottom = "12px"

            message.innerText = "Issues Found"
            message.style.margin = "0"
            message.style.fontSize = "16px"
            message.style.fontWeight = "600"
            message.style.color = "#111827"

            subMessage.innerText = "Issues were detected but no associated elements could be found on the page"
            subMessage.style.margin = "8px 0 0 0"
            subMessage.style.fontSize = "13px"
            subMessage.style.color = "#6b7280"
        } else {
            // No issues at all
            icon.innerText = "✓"
            icon.style.fontSize = "48px"
            icon.style.color = "#22c55e"
            icon.style.marginBottom = "12px"

            message.innerText = "No Issues Detected"
            message.style.margin = "0"
            message.style.fontSize = "16px"
            message.style.fontWeight = "600"
            message.style.color = "#111827"

            subMessage.innerText = "Your page looks good!"
            subMessage.style.margin = "8px 0 0 0"
            subMessage.style.fontSize = "13px"
            subMessage.style.color = "#6b7280"
        }

        noIssues.appendChild(icon)
        noIssues.appendChild(message)
        noIssues.appendChild(subMessage)
        content.appendChild(noIssues)
    }

    issuesMap.forEach(({ issues }, element) => {
        const ref = element as HTMLElement
        const btn = document.createElement("button")

        const leftContent = document.createElement("div")
        leftContent.style.display = "flex"
        leftContent.style.flexDirection = "column"
        leftContent.style.alignItems = "flex-start"
        leftContent.style.gap = "4px"
        leftContent.style.flex = "1"

        const tagName = document.createElement("span")
        tagName.innerText = ref.tagName.toLowerCase()
        tagName.style.fontWeight = "600"
        tagName.style.fontSize = "14px"
        tagName.style.color = "#111827"

        const issuePreview = document.createElement("span")
        issuePreview.innerText = issues[0]?.message || "Sin descripción"
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
        badge.innerText = issues.length.toString()
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

        const issueData = { ref, issues }

        btn.onclick = () => {
            // Remove hover tooltip before showing the main one
            if (hoverTooltip) {
                hoverTooltip.remove()
                hoverTooltip = null
            }
            highlightIssue(issueData, btn)
        }

        ref.style.outline = "2px dashed #1d4ed8"
        ref.style.outlineOffset = "2px"
        ref.setAttribute("data-issue", "true")
        ref.onmouseenter = () => {
            if (hoverTooltip) {
                hoverTooltip.remove()
                hoverTooltip = null
            }
            btn.focus()
            highlightIssue(issueData, btn, false)
        }

        global.navButtons.set(ref, btn)
        content.appendChild(btn)
    })

    bar.appendChild(content)
    return bar
}