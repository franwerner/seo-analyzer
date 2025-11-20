import toolTip from "./toolTip.ui";
import global from "./global.ui";

function highlightIssue(issue: { ref: HTMLElement; issues: { type: string; message: string }[] }, btn: HTMLElement, isFocused: boolean = true) {
    document.querySelectorAll("[data-issue='true']").forEach((el) => {
        (el as HTMLElement).style.outline = "2px dashed #1d4ed8"
            ; (el as HTMLElement).style.backgroundColor = ""
    })

    global.navButtons.forEach((b) => {
        b.classList.remove("active")
        b.style.background = "#fff"
        b.style.border = "1px solid #e5e7eb"
        b.style.color = "#000"
    })
    global.activeTooltip?.remove()

    issue.ref.style.outline = "2px solid #dc2626"
    issue.ref.style.backgroundColor = "rgba(220,38,38,0.05)"

    btn.classList.add("active")
    btn.style.background = "#fee2e2"
    btn.style.border = "1px solid #dc2626"
    btn.style.color = "#b91c1c"

    if (isFocused) issue.ref.scrollIntoView({ behavior: "smooth", block: "center" })

    global.activeTooltip = toolTip(issue)
    document.body.appendChild(global.activeTooltip)

    const rect = issue.ref.getBoundingClientRect()
    let top = window.scrollY + rect.top - global.activeTooltip.offsetHeight - 8
    let left = window.scrollX + rect.left

    // Revisar si se sale por arriba
    if (top < window.scrollY) {
        top = window.scrollY + rect.bottom + 8 // renderizar debajo
    }

    // Revisar si se sale por la derecha
    if (left + global.activeTooltip.offsetWidth > window.scrollX + window.innerWidth) {
        left = window.scrollX + rect.right - global.activeTooltip.offsetWidth // renderizar a la izquierda
    }

    // Revisar si se sale por la izquierda
    if (left < window.scrollX) {
        left = window.scrollX // pegar al borde izquierdo
    }

    global.activeTooltip.style.top = `${top}px`
    global.activeTooltip.style.left = `${left}px`
}

export default highlightIssue
