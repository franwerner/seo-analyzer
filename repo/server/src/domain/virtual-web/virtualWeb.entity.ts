import URLUtility from "@/domain/shared/utils/URL.util";
import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store";
import OpenAi from "@/infrastructure/AI/openAi.service";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import VirtualDomSummaryNotFound from "../virtual-dom/errors/VirtualDomSummaryNotFound.error";
import mainDomSummaryMock from "./mocks/mainDomSummary.mock";

/**
 * @note
 *   Se encarga de orquestar los VirtualDom, decide que responsabildades tienen cada uno, crea los resumenes etc.
 */

interface VirtualWebConfig {
    mainVirtualDomId: number,
    mainPathname: string
}


interface MainDomSummary {
    content: string,
    id: number
}

export interface VirtualWebEntityProps {
    host: string
    mainDomSummary?: MainDomSummary | null
    webConfig: VirtualWebConfig
    id: number
}

export default class VirtualWebEntity {

    vdomStore: VirtualDomStore
    host: string
    webConfig: VirtualWebConfig
    mainDomSummary?: MainDomSummary | null = null
    id: number

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { host, mainDomSummary, webConfig, id }: VirtualWebEntityProps) {

        this.host = URLUtility.normalizeHost(host)

        this.webConfig = webConfig

        this.id = id

        this.mainDomSummary = mainDomSummary

        this.vdomStore = new VirtualDomStore(this.openAi, this.puppeteer, { host })
    }


    async setMainDomSummary(summary: MainDomSummary) {
        return this.mainDomSummary = summary
    }

    getOrThrowMainDomSummary() {
        if (!this.mainDomSummary) throw new VirtualDomSummaryNotFound()
        return this.mainDomSummary
    }

    async generateMainDomSummary() {

        return mainDomSummaryMock

        const snapshot = await this.vdomStore.getOrCreate(this.webConfig.mainVirtualDomId, async (create) => {
            return create({
                pathname: this.webConfig.mainPathname,
                id: this.webConfig.mainVirtualDomId
            })
        })

        const generatedSnapshot = await snapshot.getOrGenerateSnapshot()


        const texts = generatedSnapshot.vDomContext.innerTextChunks.getChunksPartsTexts()

        const { response, ...rest } = await this.openAi.createBasicResponse(
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
            summary: response,
            ...rest
        }

    }



}
