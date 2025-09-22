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

interface VirtualDomSnapshot {
    root: HTMLComponent
    vDomContext: VDomContext
    htmlContent: string
}

class VirtualDom {
    path: string
    snapshot: Promise<VirtualDomSnapshot> | null = null
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

        const snapshot = await this.getOrGenerateSnapshot()

        try {
            return await fn(snapshot)
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

    clearSnapshot() {
        console.log(`CLEAR SNAPSHOT => ${this.path}`)
        this.snapshot = null
    }

    private async createSnapshot(): Promise<VirtualDomSnapshot> {
        const { root, vDomContext } = await this.generateVirtualDom()
        const htmlContent = root.generateHTML()
        return {
            root,
            vDomContext,
            htmlContent
        }
    }
    async getOrGenerateSnapshot() {
        try {
            /**
            * Este enfoque garantiza que solo exista una generación de snapshot a la vez.
            * Al solicitar una snapshot, se almacena la promesa correspondiente a la generación.
            * Si se vuelve a solicitar mientras la generación está en curso, se devuelve la misma promesa.
            * De esta forma, todos los consumidores esperan y reciben el mismo resultado al mismo tiempo,
            * y se evita que se creen múltiples snapshots en paralelo.
            */
            if (!this.snapshot) {
                this.snapshot = this.createSnapshot()
            }
            return await this.snapshot
        } catch (error) {
            console.log(`ERROR GENERATING SNAPSHOT => ${this.path}`)
            this.snapshot = null
            if (error instanceof ErrorHandler) {
                throw error
            } else {
                throw new ErrorHandler({
                    message: `
                    Unknown error occurred while generating the VirtualDom snapshot -
                    ${error}
                    `,
                    status_code: 500
                })
            }
        }
    }

}

export default VirtualDom
