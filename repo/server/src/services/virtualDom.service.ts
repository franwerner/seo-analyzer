import VDomContext from "@/context/vDom.context";
import type HTMLComponent from "../components/html.component";
import ErrorHandler from "../utils/errorHandler.utils";
import DomValidator from "./dom-validator";
import OpenAi from "./openAi.service";
import PuppeterService from "./puppeter.service";
import VirtualDomUtility from "@/utils/virtualDomGenerator.utils";

enum AnalyzeStatus {
    Analyzing = "analyzing",
    Idle = "idle"
}


interface VirtualDomProps {
    path: string
}

export interface VirtualDomSnapshot {
    root: HTMLComponent
    vDomContext: VDomContext
    htmlStructure: string
    htmlSemantic: Array<string>
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
        console.log(`CLEAR SNAPSHOT => ${this.path}`)
        this.snapshot = null
    }

    private async createSnapshot(): Promise<VirtualDomSnapshot> {
        /**
         * Solo se debe utilizar para la primera generación del snapshot internamente en `getOrGenerateSnapshot`
         */

        const to = await this.puppeteer.newPageIfAvailable()
        const path = `https://${this.path}`
        const htmlString = await to(path)

        const { root, vDomContext, htmlStructure, htmlSemantic } = await VirtualDomUtility.generateRoot(htmlString)

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
            console.log(`ERROR GENERATING SNAPSHOT => ${this.path} , ${error}`)
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
