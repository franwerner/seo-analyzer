import HtmlComponentFactory from "../utils/htmlComponentFactory.utilts";
import type BaseComponent from "./components/base.component"
import type HTMLComponent from "./components/html.component"
import { JSDOM, VirtualConsole } from "jsdom";
import TextComponent from "./components/text.component";
import type { Issues } from "./components/base.component";
class VirtualDom {
    path: string
    component: HTMLComponent | null
    issues: Issues
    constructor({ path }: { path: string }) {
        this.path = path
        this.component = null
        this.issues = []
    }

    generateDomJSON() {
        if (!this.component) return
        return this.component.generateJson()
    }

    async validateDom() {
        if (!this.component) return
        const issues = await this.component.validate()
        this.issues.push(...issues)
    }

    async generateVirtualDom() {

        const virtualConsole = new VirtualConsole()
        const res = await fetch(this.path)
        const htmlString = await res.text()
        const dom = new JSDOM(htmlString, { url: this.path, virtualConsole })
        const html = dom.window.document.children[0]

        if (!html || html.nodeName != "HTML") {
            throw new Error("No se encontro el elemento HTML")
        }
        const recursive = (elem: Node) => {
            let children: Array<BaseComponent | TextComponent> = []
            if (elem.hasChildNodes()) {
                for (const e of Array.from(elem.childNodes)) {
                    if (e.nodeName == "#text") {
                        const text = e.nodeValue || ""
                        if (text.trim().length > 0) {
                            children.push(new TextComponent(text))
                        }
                    }
                    else if (!["SCRIPT", "STYLE", "#comment", "NOSCRIPT"].includes(e.nodeName)) {
                        children.push(recursive(e))
                    }
                }
            }
            return HtmlComponentFactory.createComponent(elem.nodeName, children, elem as HTMLBaseElement)
        }

        return recursive(html)
    }

    async start() {
        try {
            const html = await this.generateVirtualDom()
            this.component = html
        } catch (error) {
            this.issues.push({
                message: String(error),
                type: "error",
                hash: "NO-HASH"
            })
        }
    }
}

export default VirtualDom
