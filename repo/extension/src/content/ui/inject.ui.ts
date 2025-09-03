import { ReferencesIssues } from "~/types/referencesIssues.type";
import sideBar from "./sideBar.ui";
import global from "./global.ui";


export default function injectUi(issuesElements: ReferencesIssues) {
    removeInjectedUi()

    const nav = sideBar(issuesElements)
    document.body.appendChild(nav)

    Object.values(issuesElements).forEach(({ ref }) => {
        ref.style.outline = "2px dashed #1d4ed8" // azul moderno
        ref.style.outlineOffset = "2px"
        ref.setAttribute("data-issue", "true")
    })

    global.cleanupFns.push(() => {
        nav.remove()
        global.toggleBtn?.remove()
        global.navButtons.clear()
        global.activeTooltip?.remove()
        Object.values(issuesElements).forEach(({ ref }) => {
            ref.style.outline = ""
            ref.style.outlineOffset = ""
            ref.style.backgroundColor = ""
        })
    })
}

export function removeInjectedUi() {
    global.cleanupFns.forEach((fn) => fn())
    global.cleanupFns = []
}
