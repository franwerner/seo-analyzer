import BaseComponent from "@/domain/virtual-dom/components/base.component";
import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import { ValidationTypeEnum } from "@packages/common";

const prompt = `
        Eres un asistente de corrección ortográfica.

        # Instrucciones:
        1. Analiza el TEXTO proporcionado y detecta únicamente palabras con errores **ortográficos**.
        2. Ignora por completo la gramática, sintaxis, puntuación, redacción o palabras mal empleadas en contexto. SOLO revisa si la palabra está mal escrita.
        3. No incluyas explicaciones, definiciones ni texto adicional fuera del Array.
        4. No marques como error:
        - Abreviaturas válidas (ej: "etc.", "Sr.", "Dr.", "vs.")
        - Siglas o acrónimos en mayúsculas (ej: "ONU", "NASA")
        - Palabras técnicas correctamente escritas.
        5. Cada palabra debe aparecer solo una vez en el Array, aunque se repita en el texto.
`

export default class SpellingValidation extends ValidationUtility {
    constructor(
        private openAI: OpenAi,
        private context: VDomContext,
    ) {
        super()
    }

    private async getCheckWordsResult() {
        const queries = this.context.innerTextChunks.chunks
            .map(chunk =>
                this.openAI.generateIssueWords(JSON.stringify(chunk.parts_texts), prompt)
            )
        const results = await Promise.all(queries)

        /**
         * Aquí se agrupan todas las palabras incorrectas detectadas para verificarlas en todos los chunks.
         *
         * Esto es necesario porque la IA no siempre marca todas las palabras incorrectas en cada chunk, 
         * incluso si aparecen en diferentes chunks. Agrupando todas las palabras detectadas y buscándolas 
         * en todos los chunks, nos aseguramos de no pasar por alto ningún error ortográfico.
         */

        return results.reduce((acc, query) => {
            query.words.forEach(word => acc.words.add(word))
            acc.tokens.input += query.tokens.input
            acc.tokens.output += query.tokens.output
            return acc
        }, {
            words: new Set<string>(),
            tokens: {
                input: 0,
                output: 0
            }
        })
    }


    private async groupWordsByComponent(words: Set<string>) {

        /**
        * `groupedWordsByComponent` agrupa todas las palabras incorrectas por componente, 
        * de manera que se genere un único ISSUE por componente con el listado completo de palabras.
        * 
        * Se utiliza un Set para evitar duplicados en caso de que la IA devuelva la misma palabra más de una vez.
        * 
        * Al ser global entre todos los chunks de esta validación, también cubre el caso en que un mismo componente 
        * aparezca en múltiples chunks debido a que su contenido supera el límite de palabras (ver `TextChunker`).
        */

        const chunks = this.context.innerTextChunks.chunks
        let groupedWordsByComponent = new Map<BaseComponent, Set<string>>()

        for (const word of words) {

            for (const chunk of chunks) {

                chunk.forEachPartMatchingWord(word, (part) => {
                    const group = groupedWordsByComponent.get(part)
                    if (group) {
                        group.add(word)
                    } else {
                        groupedWordsByComponent.set(part, new Set([word]))
                    }
                })

            }
        }

        return groupedWordsByComponent
    }

    async validate() {

        const { words, tokens } = await this.getCheckWordsResult()

        const groupedWordsByComponent = await this.groupWordsByComponent(words)

        this.addTokens(tokens)

        groupedWordsByComponent.forEach((words, part) => {
            const toArray = Array.from(words)
            this.addIssue({
                message: `Words [${toArray.join(", ")}] are not correct`,
                type: ValidationTypeEnum.SPELLING,
                tag: part.tag,
                traceIds: [part.traceId]
            })
        })
    }

}