import { JSDOM, VirtualConsole } from "jsdom";
import BaseComponent from "../components/base.component";
import type HTMLComponent from "../components/html.component";
import TextComponent from "../components/text.component";
import ComponentFactory from "../utils/componentFactory.utilts";
import ErrorHandler from "../utils/errorHandler.utils";
import DomValidator from "./dom-validator";
import OpenAi from "./openAi.service";
import PuppeterService from "./puppeter.service";
import VDomContext from "@/context/vDom.context";


/**
 * Contexto que se genera unica vez cuando se inicia un virtual dom.
 * Nos ayuda a pasar informacion entre todos lo nodos para evalucaciones mas generales.
 */

const virtualConsole = new VirtualConsole()

interface VirtualDomProps {
    path: string
}

class VirtualDom {
    path: string
    root: HTMLComponent | null
    private html: string
    private vDomContext: VDomContext
    domValidator: DomValidator
    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { path }: VirtualDomProps
    ) {
        this.path = path
        this.root = null
        this.html = ""
        this.vDomContext = new VDomContext()
        this.domValidator = new DomValidator(this.openAi)
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
            throw new ErrorHandler({
                message: "HTML element not found",
                status_code: 404
            })
        }

        const recursive = (elem: Element, pathDom: string) => {
            let children: Array<BaseComponent | TextComponent> = []

            if (elem.hasChildNodes()) {
                for (let i = 0; i < elem.childNodes.length; i++) {
                    const child = elem.childNodes[i] as ChildNode
                    if (child.nodeName == "#text") {
                        const text = child.nodeValue || ""
                        if (text.trim().length > 0) {
                            children.push(new TextComponent(text))
                        }
                    }
                    else if (!["STYLE", "#comment", "svg", "NOSCRIPT"].includes(child.nodeName)) {
                        const node = recursive(child as Element, pathDom + "/" + child.nodeName + "/" + i)
                        if (node.isIgnored) continue
                        children.push(node)
                    }
                }
            }

            const Component = ComponentFactory.getComponent(elem.nodeName)
            return new Component({
                tag: elem.nodeName,
                attributes: elem.attributes,
                vDomContext: this.vDomContext,
                children,
                pathDom,
            })
        }

        return recursive(html, html.nodeName)
    }

    async validate(analyze: "full" | "basic" = "basic") {

        const fn = analyze === "basic" ?
            this.domValidator.runBasicValidation.bind(this.domValidator) :
            this.domValidator.runValidation.bind(this.domValidator)

        try {
            return await fn({
                root: this.assertRoot(),
                html: this.getOrGenerateHTML(),
                vDomContext: this.vDomContext
            })
        } catch (error) {
            console.log(`ERROR VALIDATING DOM - ${error}`)
            throw new ErrorHandler({
                message: `ERROR VALIDATING DOM - ${error}`,
                status_code: 500
            })
        }
    }

    async start() {
        try {
            this.vDomContext = new VDomContext()
            this.root = await this.generateVirtualDom()
            this.html = this.root.generateHTML()
        } catch (error) {
            console.log(error)
            if (error instanceof ErrorHandler) {
                throw error
            } else {
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
}

export default VirtualDom
