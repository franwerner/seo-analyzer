import global from "./global.ui";
import sideBar from "./sideBar.ui";
import { IssuesGroupByElement } from "~/types/issuesGroupByElement.type";

export type AnalysisUsage = { input: number; output: number }

export default function injectUi(issuesElements: IssuesGroupByElement, usage?: AnalysisUsage, issuesCount?: number) {
    removeInjectedUi()

    const nav = sideBar(issuesElements, usage, issuesCount)
    document.body.appendChild(nav)

    global.cleanupFns.push(() => {
        nav.remove()
        global.toggleBtn?.remove()
        global.navButtons.clear()
        global.activeTooltip?.remove()
        issuesElements.forEach((value, element) => {
            element.style.outline = ""
            element.style.outlineOffset = ""
            element.style.backgroundColor = ""
        })
    })
}

export function removeInjectedUi() {
    global.cleanupFns.forEach((fn) => fn())
    global.cleanupFns = []
}
