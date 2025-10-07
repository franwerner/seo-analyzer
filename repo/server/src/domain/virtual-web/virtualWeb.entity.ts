import OpenAi from "@/infrastructure/AI/openAi.service";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";
import { Tokens } from "@/domain/virtual-dom/types/Tokens.interface";
import { WebSummary } from "@/domain/virtual-web/types/WebSummary.interface";
import VirtualDomStore from "@/domain/virtual-dom/store/virtualDom.store";
import { URLInterface } from "@/shared/utils/URL.util";

/**
 * @note
 *   Se encarga de orquestar los VirtualDom, decide que responsabildades tienen cada uno, crea los resumenes etc.
 */


export interface VirtualWebProps {
    url: URLInterface
    webSummary?: WebSummary | null
}

export default class VirtualWeb {

    vdomStore: VirtualDomStore
    url: URLInterface
    webSummary?: WebSummary | null = null

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { url, webSummary }: VirtualWebProps) {

        this.url = url

        this.webSummary = webSummary

        this.vdomStore = new VirtualDomStore(this.openAi, this.puppeteer, { host: url.host })
    }


    async setWebSummary() {
        const res = await this.generateWebSummary()
        return this.webSummary = res.webSummary
    }

    async generateWebSummary(): Promise<{
        webSummary: WebSummary,
        tokens: Tokens
    }> {
        const snapshot = await this.vdomStore.getOrCreate(this.url.pathname).getOrGenerateSnapshot()

        const texts = snapshot.vDomContext.innerTextChunks.getChunksPartsTexts()

        const { response, tokens } = await this.openAi.createBasicResponse(
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
            webSummary: {
                summary: response,
                generatedAt: new Date(),
                pathnameByGeneration: this.url.pathname,
            },
            tokens: tokens
        }


    }



}
