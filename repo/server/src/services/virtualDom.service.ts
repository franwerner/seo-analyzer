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
import { AnalyzeType } from "@/types/AnalyzeType.enum";

enum AnalyzeStatus {
    Analyzing = "analyzing",
    Idle = "idle"
}

const ignoreTags = ["STYLE", "#comment", "svg", "NOSCRIPT"]

const virtualConsole = new VirtualConsole()

interface VirtualDomProps {
    path: string
}

class VirtualDom {
    path: string
    root: HTMLComponent | null = null
    private html: string | null = null
    private vDomContext: VDomContext | null = null
    analyzeStatus: AnalyzeStatus = AnalyzeStatus.Idle
    domValidator: DomValidator
    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { path }: VirtualDomProps
    ) {
        this.path = path
        this.domValidator = new DomValidator(this.openAi)
    }

    calculateTokens() {
        return OpenAi.calculateTokens(this.getOrGenerateHTML())
    }

    getOrThrowRoot() {
        if (!this.root) throw new ErrorHandler({
            message: "VirtualDom not generated",
            status_code: 404
        })
        return this.root
    }

    private getOrThrowVDomContext() {
        if (!this.vDomContext) throw new ErrorHandler({
            message: "VDomContext not found",
            status_code: 404
        })
        return this.vDomContext
    }

    getOrGenerateHTML() {
        const root = this.getOrThrowRoot()
        if (this.html) return this.html
        return (this.html = root.generateHTML())

    }

    async generateVirtualDom() {
        const to = await this.puppeteer.newPageIfAvailable()
        const htmlString = await to("https://" + this.path)
        const dom = new JSDOM(htmlString, { virtualConsole })
        const html = dom.window.document.children[0]

        if (!html || html.nodeName != "HTML") {
            throw new ErrorHandler({
                message: "HTML element not found",
                status_code: 404
            })
        }

        const vDomContext = new VDomContext()

        const recursive = (elem: Element, pathDom: string, parent: BaseComponent) => {

            let children: Array<BaseComponent | TextComponent> = []

            const Component = ComponentFactory.getComponent(elem.nodeName)

            const component = new Component({
                tag: elem.nodeName,
                attributes: elem.attributes,
                vDomContext,
                children,
                pathDom,
                parent
            })

            for (let i = 0; i < elem.childNodes.length; i++) {

                const child = elem.childNodes[i] as ChildNode
                const isText = child.nodeName == "#text"

                if (isText) {
                    const text = child.nodeValue || ""
                    if (text.trim().length > 0) {
                        const textComponent = new TextComponent({
                            text,
                            parent: component
                        })
                        children.push(textComponent)
                    }
                } else if (!ignoreTags.includes(child.nodeName)) {
                    const nextPath = pathDom + "/" + child.nodeName + "/" + i
                    const node = recursive(
                        child as Element,
                        nextPath,
                        component
                    )
                    children.push(node)
                }
            }

            component.setShouldIgnore()
            component.contextualizeVDom()
            return component
        }

        //@ts-ignore
        const root = recursive(html, html.nodeName) as HTMLComponent

        return {
            root,
            vDomContext
        }
    }

    private setStatus(status: AnalyzeStatus) {
        this.analyzeStatus = status
    }

    private throwIfAnalyzing() {
        if (this.analyzeStatus === AnalyzeStatus.Analyzing)
            throw new ErrorHandler({
                message: "The virtual dom is being analyzed, one request at a time",
                status_code: 400
            })
    }

    async analyze(analyze: AnalyzeType = AnalyzeType.Basic) {

        this.throwIfAnalyzing()

        const fn = analyze === AnalyzeType.Basic ?
            this.domValidator.runBasicValidation.bind(this.domValidator) :
            this.domValidator.runValidation.bind(this.domValidator)

        this.setStatus(AnalyzeStatus.Analyzing)

        try {
            const res = await fn({
                root: this.getOrThrowRoot(),
                html: this.getOrGenerateHTML(),
                vDomContext: this.getOrThrowVDomContext()
            })
            return res
        } catch (error) {
            console.log(`ERROR VALIDATING DOM - ${error}`)
            if (error instanceof ErrorHandler) throw error
            throw new ErrorHandler({
                message: `ERROR VALIDATING DOM - ${error}`,
                status_code: 500
            })
        } finally {
            this.setStatus(AnalyzeStatus.Idle)
        }

    }

    clearVdom() {
        console.log(`CLEAR VDOM => ${this.path}`)
        this.vDomContext = null
        this.root = null
        this.html = null
    }

    async generate() {
        try {
            const { root, vDomContext } = await this.generateVirtualDom()
            this.root = root
            this.vDomContext = vDomContext
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
