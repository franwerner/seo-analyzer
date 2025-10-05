import DomValidator from "@/domain/virtual-dom/services/dom-validator";
import OpenAi from "@/infrastructure/AI/openAi.service";
import { Tokens } from "@/shared/types/Tokens.interface";
import { WebSummary } from "@/shared/types/WebSummary.interface";
import VirtualDomStore from "../../virtual-dom/store/virtualDom.store";
import PuppeterService from "@/infrastructure/scrapper/puppeter.service";

/**
 * @note
 *   Se encarga de orquestar los VirtualDom, decide que responsabildades tienen cada uno, crea los resumenes etc.
 */


export interface VirtualWebProps {
    host: string
    mainPathname: string
    webSummary?: WebSummary | null
}

export default class VirtualWeb {

    vdomStore: VirtualDomStore
    host: string
    mainPathname: string
    private webSummary?: WebSummary | null = null

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { host, webSummary, mainPathname }: VirtualWebProps) {

        this.host = host

        this.mainPathname = mainPathname

        this.webSummary = webSummary

        this.vdomStore = new VirtualDomStore(this.openAi, this.puppeteer, { host })
    }


    async generateWebSummary(): Promise<{
        webSummary: WebSummary,
        tokens: Tokens
    }> {

        const snapshot = await this.vdomStore.getOrCreate(this.mainPathname).getOrGenerateSnapshot()

        const texts = snapshot.vDomContext.innerTextChunks.chunks.map(chunk => chunk.parts_texts).flat()

        const { response, tokens } = await this.openAi.createBasicResponse(
            JSON.stringify(texts),
            `
        Instrucciones:
        Recibirás un array de strings, cada indice del array representa una parte(oracion) del contenido de un sitio web. 
        Tu tarea es analizar todo el contenido y generar un resumen conciso y extenso que capture la esencia del sitio.

        El resumen debe incluir:
        De qué trata el sitio web.

        Principales características y elementos destacados.
        A qué se dedica, cuál es su actividad principal o propósito.
        Qué ofrece y para quién está dirigido.

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
                pathnameByGeneration: this.mainPathname,
            },
            tokens: tokens
        }


    }



}
