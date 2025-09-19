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

    assertRoot() {
        if (!this.root) throw new ErrorHandler({
            message: "VirtualDom not initialized",
            status_code: 500
        })
        return this.root
    }

    private getOrThrowVDomContext() {
        if (!this.vDomContext) throw new ErrorHandler({
            message: "VirtualDom not initialized",
            status_code: 500
        })
        return this.vDomContext
    }

    getOrGenerateHTML() {
        const root = this.assertRoot()
        if (this.html) return this.html
        return (this.html = root.generateHTML())

    }

    async generateVirtualDom() {
        const to = await this.puppeteer.newPageIfAvailable()
        const htmlString = await to(this.path)
        const dom = new JSDOM(htmlString, { virtualConsole })
        const html = dom.window.document.children[0]

        if (!html || html.nodeName != "HTML") {
            throw new ErrorHandler({
                message: "HTML element not found",
                status_code: 404
            })
        }

        const vDomContext = new VDomContext()

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
                vDomContext,
                children,
                pathDom,
            })
        }

        const root = recursive(html, html.nodeName)

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
                root: this.assertRoot(),
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

    private resetVdom() {
        /**
        * Reinicia el estado del Virtual DOM antes de generar uno nuevo o simplemente limpiar cache.
        *
        * - Si hay un análisis en curso, se lanza un error para evitar conflictos.
        * - Limpia el estado anterior (root, html, vDomContext) para asegurar que
        *   no quede información residual al crear un nuevo Virtual DOM.
        *
        * Nota: Esto evita condiciones de carrera. Al resetear antes de cualquier
        * async/await, garantizamos que funciones como `analyze` no accedan a un
        * root o html desfasado o incompleto.
        */
        this.throwIfAnalyzing()
        this.vDomContext = null
        this.root = null
        this.html = null
    }

    async generate() {

        try {
            this.resetVdom()
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
