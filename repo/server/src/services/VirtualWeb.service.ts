import ErrorHandler from "@/utils/errorHandler.utils";
import VirtualDom from "./virtualDom.service";
import OpenAi from "./openAi.service";
import PuppeterService from "./puppeter.service";
import VirtualDomStore from "./VirtualDomStore.service";

/**
 * @note
 *   Se encarga de orquestar los VirtualDom, decide que responsabildades tienen cada uno, crea los resumenes etc.
 */

export default class VirtualWeb {

    host: string
    vdomStore: VirtualDomStore
    mainVirtualDom: VirtualDom | null = null
    summaryContext: string | null = null

    constructor(
        private openAi: OpenAi,
        private puppeteer: PuppeterService,
        { host }: { host: string }) {
        this.host = host
        this.vdomStore = new VirtualDomStore(this.openAi, this.puppeteer, { host })
    }


    setMainVDom(pathname: string) {
        this.mainVirtualDom = this.vdomStore.getOrCreate(pathname)
    }

    getOrThrowMainVdom() {
        if (!this.mainVirtualDom) throw new ErrorHandler({
            message: "Main VirtualDom not found",
            status_code: 404
        })
        return this.mainVirtualDom
    }

    async createContextSummary() {
        const mainVdom = this.getOrThrowMainVdom()
        const snapshot = await mainVdom.getOrGenerateSnapshot()

        const texts = snapshot.vDomContext.innerTextChunks.chunks.map(chunk => chunk.parts_texts).flat()

        console.log(snapshot.vDomContext.innerTextChunks.chunks.reduce((acc, chunk) => acc + chunk.parts_texts.length, 0))
        const { response, tokens } = await this.openAi.createBasicResponse(
            JSON.stringify(texts),
            `
                  Instrucciones:
                  Recibirás un array de strings, cada uno representando una parte del contenido de un sitio web. 
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


        console.log(tokens)

        return response


    }



}
