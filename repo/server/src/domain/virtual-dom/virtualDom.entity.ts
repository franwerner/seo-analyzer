import { URLInterface } from "@/domain/shared/utils/URL.util";
import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import HTMLComponent from "./components/html.component";
import VirtualDomGeneratedSnapshotError from "./errors/VirtualDomGeneratedSnapshot.error";
import analysisMock from "./mock/analysis.mock";
import DomAnalysis from "./services/dom-analysis";
import SnapshotGeneratorUtility from "./utils/snapshotGenerator.utils";
import { ValidationsType } from "@seo-analyzer/common";


export interface VirtualDomEntityProps {
    url: URLInterface
    id: number
}

export interface VirtualDomSnapshot {
    root: HTMLComponent
    vDomContext: VDomContext
    htmlStructure: string
    htmlSemantic: Array<string>
}

class VirtualDomEntity {
    url: URLInterface
    id: number
    snapshot: Promise<VirtualDomSnapshot> | null = null
    constructor(
        private scrapperService: PuppeterService,
        private domAnalysis: DomAnalysis,
        { url, id }: VirtualDomEntityProps
    ) {
        this.id = id
        this.url = url
    }

    async analyze(domSummary: string, validationsSelected: ValidationsType) {

        const snapshot = await this.getOrGenerateSnapshot()

        return await this.domAnalysis.runAnalysis({
            snapshot,
            domSummary,
            validationsSelected,
        })
    }

    clearSnapshot() {
        console.log(`CLEAR SNAPSHOT => ${this.url.href}`)
        this.snapshot = null
    }

    private async createSnapshot(): Promise<VirtualDomSnapshot> {
        /**
         * Solo se debe utilizar para la primera generación del snapshot internamente en `getOrGenerateSnapshot`
         */
        const to = await this.scrapperService.newPageIfAvailable()
        const url = this.url.href
        const htmlElement = await to(url)

        const { root, vDomContext, htmlStructure, htmlSemantic } = await SnapshotGeneratorUtility.generate({
            htmlElement,
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
            return await this.snapshot
        } catch (error) {
            this.snapshot = null
            throw new VirtualDomGeneratedSnapshotError(error)
        }
    }

}

export default VirtualDomEntity
