import { URLInterface } from "@/domain/shared/utils/URL.util";
import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import { ValidationsType } from "@seo-analyzer/common";
import HTMLComponent from "./components/html.component";
import VirtualDomGeneratedSnapshotError from "./errors/VirtualDomGeneratedSnapshot.error";
import DomAnalysis from "./services/dom-analysis";
import SnapshotGeneratorUtility from "./utils/snapshotGenerator.utils";
import { Element } from "domhandler"

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
    private snapshotStore: Map<string, VirtualDomSnapshot> = new Map()
    constructor(
        private domAnalysis: DomAnalysis,
        { url, id }: VirtualDomEntityProps
    ) {
        this.id = id
        this.url = url
    }

    async analyze({
        domSummary,
        validationsSelected,
        htmlElement,
        snapshotId
    }: {
        domSummary: string,
        validationsSelected: ValidationsType,
        htmlElement: Element,
        snapshotId: string
    }) {

        const snapshot = await this.getOrGenerateSnapshot(htmlElement, snapshotId)

        return await this.domAnalysis.runAnalysis({
            snapshot,
            domSummary,
            validationsSelected,
        })
    }

    clearSnapshot(snapshotId: string) {
        console.log(`CLEAR SNAPSHOT => ${this.url.href} [${snapshotId}]`)
        this.snapshotStore.delete(snapshotId)
    }

    clearAllSnapshots() {
        console.log(`CLEAR ALL SNAPSHOTS => ${this.url.href}`)
        this.snapshotStore.clear()
    }

    private createSnapshot(htmlElement: Element, snapshotId: string): VirtualDomSnapshot {
        /**
         * Solo se debe utilizar para la primera generación del snapshot internamente en `getOrGenerateSnapshot`
         */

        const { root, vDomContext, htmlStructure, htmlSemantic } = SnapshotGeneratorUtility.generate({
            htmlElement,
            document: this
        })

        const snapshot = {
            root,
            vDomContext,
            htmlStructure,
            htmlSemantic
        }

        this.snapshotStore.set(snapshotId, snapshot)
        return snapshot
    }

    getOrGenerateSnapshot(htmlElement: Element, snapshotId: string) {
        try {
            /**
            * Este enfoque utiliza un Map con IDs únicos para identificar cada snapshot.
            * Cada análisis puede venir de una instancia diferente de la página (trace-ids diferentes),
            * por lo que se requiere un ID único (snapshotId) generado desde la página.
            * Si el snapshot con ese ID ya existe en el Map, se devuelve.
            * Si no existe, se genera uno nuevo y se almacena en el Map con ese ID.
            */
            const existingSnapshot = this.snapshotStore.get(snapshotId)
            if (existingSnapshot) {
                return existingSnapshot
            }
            return this.createSnapshot(htmlElement, snapshotId)
        } catch (error) {
            this.snapshotStore.delete(snapshotId)
            throw new VirtualDomGeneratedSnapshotError(error)
        }
    }

}

export default VirtualDomEntity
