import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import type HTMLComponent from "../components/html.component";
import DomValidator from "../services/dom-validator";
import { URLInterface } from "@/types/URL.interface";
import VirtualDomGeneratorUtility from "../utils/virtualDomGenerator.utils";
import PuppeterService from "@/services/puppeter.service";
import ErrorHandler from "@/utils/errorHandler.utils";

enum AnalyzeStatus {
    Analyzing = "analyzing",
    Idle = "idle"
}

interface VirtualDomProps {
    url: URLInterface
    domValidator: DomValidator
}

export interface VirtualDomSnapshot {
    root: HTMLComponent
    vDomContext: VDomContext
    htmlStructure: string
    htmlSemantic: Array<string>
}

class VirtualDom {
    url: URLInterface
    snapshot: Promise<VirtualDomSnapshot> | null = null
    analyzeStatus: AnalyzeStatus = AnalyzeStatus.Idle
    domValidator: DomValidator
    constructor(
        private puppeteer: PuppeterService,
        { url, domValidator }: VirtualDomProps
    ) {
        this.url = url
        this.domValidator = domValidator
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

    async analyze() {

        this.throwIfAnalyzing()

        this.setStatus(AnalyzeStatus.Analyzing)

        const snapshot = await this.getOrGenerateSnapshot()

        try {
            return await this.domValidator.runValidation(snapshot)
        } catch (error) {
            console.log(`ERROR ANALYZING DOM - ${error}`)
            if (error instanceof ErrorHandler) throw error
            throw new ErrorHandler({
                message: `ERROR ANALYZING DOM - ${error}`,
                status_code: 500
            })
        } finally {
            this.setStatus(AnalyzeStatus.Idle)
        }

    }

    clearSnapshot() {
        console.log(`CLEAR SNAPSHOT => ${this.url.href}`)
        this.snapshot = null
    }

    private async createSnapshot(): Promise<VirtualDomSnapshot> {
        /**
         * Solo se debe utilizar para la primera generación del snapshot internamente en `getOrGenerateSnapshot`
         */
        const to = await this.puppeteer.newPageIfAvailable()
        const url = this.url.href
        const htmlString = await to(url)

        const { root, vDomContext, htmlStructure, htmlSemantic } = await VirtualDomGeneratorUtility.generateRoot(htmlString)

        return {
            root,
            vDomContext,
            htmlStructure,
            htmlSemantic
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
            console.log(`ERROR GENERATING SNAPSHOT => ${this.url.href} , ${error}`)
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
