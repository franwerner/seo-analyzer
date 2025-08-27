import ComponentFactory from "../utils/componentFactory.utilts";
import BaseComponent from "../components/base.component"
import type HTMLComponent from "../components/html.component"
import { JSDOM, VirtualConsole } from "jsdom";
import TextComponent from "../components/text.component";
import puppeteer from "puppeteer";
import type { Issues } from "../schemas/issues.schema";


class VirtualDom {
    path: string
    root: HTMLComponent | null
    globalIssues: Issues
    constructor({ path }: { path: string }) {
        this.path = path
        this.root = null
        this.globalIssues = []
    }

    generateDomHTML() {
        console.time("generateDomHTML")
        if (!this.root) return
        console.timeEnd("generateDomHTML")
        return this.root.generateHTML()
    }

    async validateDom() {
        console.time("validateDom")
        if (!this.root) return
        const tree = async (component: BaseComponent): Promise<Issues> => {
            let issues: Issues = []
            const validate = component.validate()
            const filterComponents = component.children.filter(child => child instanceof BaseComponent)
            const promises = filterComponents.map(child => tree(child))
            issues.push(...await validate)
            const results = await Promise.all(promises)
            issues.push(...results.flat())
            return issues
        }
        this.globalIssues = await tree(this.root)
        console.timeEnd("validateDom")
    }

    async generateVirtualDom() {
        console.time("generateVirtualDom")
        const virtualConsole = new VirtualConsole()
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(this.path)
        const htmlString = await page.content()
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
            return ComponentFactory.createComponent(elem as HTMLBaseElement, children)
        }

        console.timeEnd("generateVirtualDom")
        return recursive(html)
    }

    async start() {
        try {
            const html = await this.generateVirtualDom()
            this.root = html
        } catch (error) {
            this.globalIssues.push({
                message: String(error),
                traceIds: [],
                tag: "html"
            })
        }
    }
}

export default VirtualDom
