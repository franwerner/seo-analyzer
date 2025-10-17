import URLUtility from "@/domain/shared/utils/URL.util";
import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store";
import OpenAiService from "@/infrastructure/AI/openAi.service";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import { VirtualWebSummary } from "@seo-analyzer/common";
import VirtualDomSummaryNotFound from "../virtual-dom/errors/VirtualDomSummaryNotFound.error";
import mainDomSummaryMock from "./mocks/mainDomSummary.mock";

/**
 * @note
 *   Se encarga de orquestar los VirtualDom, decide que responsabildades tienen cada uno, crea los resumenes etc.
 */

interface VirtualWebConfig {
    virtualDom: {
        id: number,
        pathname: string
    }
}


export interface VirtualWebEntityProps {
    host: string
    virtualWebSummary?: VirtualWebSummary | null
    virtualWebConfig: VirtualWebConfig
    id: number
}

export default class VirtualWebEntity {

    vdomStore: VirtualDomStore
    host: string
    virtualWebConfig: VirtualWebConfig
    virtualWebSummary?: VirtualWebSummary | null = null
    id: number

    constructor(
        private AiService: OpenAiService,
        private puppeteer: PuppeterService,
        { host, virtualWebSummary, virtualWebConfig, id }: VirtualWebEntityProps) {

        this.host = URLUtility.normalizeHost(host)

        this.virtualWebConfig = virtualWebConfig

        this.id = id

        this.virtualWebSummary = virtualWebSummary

        this.vdomStore = new VirtualDomStore(this.AiService, this.puppeteer, { host })
    }

    setHost(host: string) {
        this.host = URLUtility.normalizeHost(host)
    }

    async setVirtualWebSummary(summary: VirtualWebSummary) {
        return this.virtualWebSummary = summary
    }

    getOrThrowVirtualWebSummary() {
        if (!this.virtualWebSummary) throw new VirtualDomSummaryNotFound()
        return this.virtualWebSummary
    }

    async generateWebSummary() {

        return mainDomSummaryMock

        const snapshot = await this.vdomStore.getOrCreate(this.virtualWebConfig.virtualDom.id, async (create) => {
            return create({
                pathname: this.virtualWebConfig.virtualDom.pathname,
                id: this.virtualWebConfig.virtualDom.id
            })
        })

        const generatedSnapshot = await snapshot.getOrGenerateSnapshot()


        const texts = generatedSnapshot.vDomContext.innerTextChunks.getChunksPartsTexts()

        const { response, ...rest } = await this.AiService.createBasicResponse(
            JSON.stringify(texts),
            `
        Instrucciones:
        Recibirás un array de strings, cada indice del array representa una parte(oracion) del contenido de un sitio web. 
        Tu tarea es analizar todo el contenido y generar un resumen conciso y extenso que capture la esencia del sitio.

        Principales características y elementos destacados.
        Asegúrate de que el resumen capture la esencia del contenido, especialmente los aspectos más importantes que el schema debe reflejar,
        como el nombre de la empresa, servicios, productos, ubicación, entre otros.

        Requisitos:

        El resumen debe estar escrito en un solo bloque de texto, sin listas ni viñetas.
        Usa un lenguaje natural y claro, pensado para análisis SEO.
        Evita comentarios adicionales, instrucciones o explicaciones fuera del resumen.
        El texto debe ser suficientemente descriptivo para entender el sitio en profundidad, pero sin extenderse innecesariamente.
        `
        )

        return {
            content: response,
            model: this.AiService.model.name,
            ...rest
        }

    }



}
