import ComponentFactory from "../utils/componentFactory.utilts";
import BaseComponent from "../components/base.component"
import type HTMLComponent from "../components/html.component"
import { JSDOM, VirtualConsole } from "jsdom";
import TextComponent from "../components/text.component";
import type { Issues } from "../schemas/issues.schema";
import OpenAi from "./openAi.service";
import ErrorHandler from "../utils/errorHandler.utils";
import PuppeterService from "./puppeter.service";

const virtualConsole = new VirtualConsole()

interface VirtualDomProps {
    path: string
}

class VirtualDom {
    path: string
    root: HTMLComponent | null
    private html: string
    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { path }: VirtualDomProps
    ) {
        this.path = path
        this.root = null
        this.html = ""
    }

    calculateTokens() {
        return OpenAi.calculateTokens(this.getOrGenerateHTML())
    }

    assertRoot() {
        if (!this.root) throw new ErrorHandler({
            message: "VirtualDom not initialized",
            status_code: 500
        })
        return this.root
    }

    getOrGenerateHTML() {
        const root = this.assertRoot()
        if (this.html) return this.html
        this.html = root.generateHTML()
        return this.html
    }

    async generateVirtualDom() {
        const to = await this.puppeteer.newPageIfAvailable()
        const htmlString = await to(this.path)
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
                    else if (!["SCRIPT", "STYLE", "#comment", "svg", "LINK"].includes(e.nodeName)) {
                        children.push(recursive(e))
                    }
                }
            }
            return ComponentFactory.createComponent(elem as HTMLBaseElement, children)
        }
        return recursive(html)

    }

    private async validateDom() {
        const root = this.assertRoot()
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
        return await tree(root)
    }

    private async validateWithOpenAI() {
        const html = this.getOrGenerateHTML()
        return await this.openAi.generateIssues(html)
    }

    async validateAll() {
        const {
            feedback,
            issues,
            tokens
        } = await this.validateWithOpenAI()
        const validateIssues = await this.validateDom()
        return {
            issues: [...validateIssues, ...issues],
            feedback,
            tokens
        }
    }

    async start() {
        try {
            this.root = await this.generateVirtualDom()
        } catch (error) {
            console.log(error)
            throw new ErrorHandler({
                message: `
                Unknown error occurred while initializing the VirtualDom -
                ${error}
                `,
                status_code: 500
            })
        }
    }
}

export default VirtualDom
