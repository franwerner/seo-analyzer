import { ReferencesIssues } from "~/types/referencesIssues.type";
import global from "./global.ui";
import sideBar from "./sideBar.ui";


export default function injectUi(issuesElements: ReferencesIssues) {
    removeInjectedUi()

    const nav = sideBar(issuesElements)
    document.body.appendChild(nav)

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
