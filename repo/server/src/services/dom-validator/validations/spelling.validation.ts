import BaseComponent from "@/components/base.component";
import VDomContext from "@/context/vDom.context";
import { Tokens } from "@/schemas/openAiOutput.schema";
import OpenAi from "@/services/openAi.service";
import { Chunk } from "@/utils/textChunker.util";
import ValidationUtility from "@/utils/validation.util";

interface QueryResult {
    query: {
        tokens: Tokens,
        words: string[]
    }
    chunk: Chunk
}

export default class SpellingValidation extends ValidationUtility {
    constructor(
        private context: VDomContext,
        private openAI: OpenAi
    ) {
        super()
    }

    private async getCheckWordsResult() {
        const queries = this.context.innerTextChunks.chunks
            .map(chunk =>
                this.openAI.generateIssueWords(JSON.stringify(chunk.parts_texts))
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
            console.log(query)
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
                type: "spelling",
                tag: part.tag,
                traceIds: [part.traceId]
            })
        })
    }

}