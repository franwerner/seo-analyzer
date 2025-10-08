import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import { URLInterface } from "@/shared/utils/URL.util";
import HTMLComponent from "./components/html.component";
import DomValidator from "./services/dom-validator";
import VirtualDomAnalysisError from "./errors/VirtualDomAnalysis.error";
import VirtualDomAnalysisInProgressError from "./errors/VirtualDomAnalysisInProgress.error";
import VirtualDomGeneratedSnapshotError from "./errors/VirtualDomGeneratedSnapshot.error";
import { ValidationsType } from "./types/ValidationType.enum";
import SnapshotGeneratorUtility from "./utils/snapshotGenerator.utils";

enum AnalyzeStatus {
    Analyzing = "analyzing",
    Idle = "idle"
}

interface VirtualDomProps {
    url: URLInterface
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
    constructor(
        private puppeteer: PuppeterService,
        public domValidator: DomValidator,
        { url }: VirtualDomProps
    ) {
        this.url = url
    }

    private setStatus(status: AnalyzeStatus) {
        this.analyzeStatus = status
    }

    private throwIfAnalyzing() {
        if (this.analyzeStatus === AnalyzeStatus.Analyzing)
            throw new VirtualDomAnalysisInProgressError()
    }

    async analyze(pageSummary: string, validationsSelected: ValidationsType) {

        this.throwIfAnalyzing()

        this.setStatus(AnalyzeStatus.Analyzing)


        try {
            const snapshot = await this.getOrGenerateSnapshot()
            return await this.domValidator.runValidation({ snapshot, pageSummary, validationsSelected })
        } catch (error) {
            if (error instanceof VirtualDomGeneratedSnapshotError) {
                throw error
            } else {
                throw new VirtualDomAnalysisError(error)
            }
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

        const { root, vDomContext, htmlStructure, htmlSemantic } = await SnapshotGeneratorUtility.generate({
            htmlString,
            document: this
        })

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
            await this.snapshot // Esperar a que se genere el snapshot para que se capture el error.
            return this.snapshot
        } catch (error) {
            this.snapshot = null
            throw new VirtualDomGeneratedSnapshotError(error)
        }
    }

}

export default VirtualDom
