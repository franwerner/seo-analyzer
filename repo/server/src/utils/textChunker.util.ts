import BaseComponent from "@/components/base.component"

export class Chunk {
    constructor(
        public total_words: number,
        public parts: Array<BaseComponent>,
        public parts_texts: Array<string>
    ) { }


    forEachPartMatchingWord(word: string, callback: (part: BaseComponent) => void) {
        const regex = new RegExp(`\\b${word}\\b`, "i") //case-insensitive
        return this.parts.forEach(part => {
            if (!part.innerText || !regex.test(part.innerText)) return
            callback(part)
        })
    }
}

/**
 * @Funcionalidad futura:
 * Actualmente, el chunk almacena correctamente hasta el límite de palabras.
 * Sin embargo, si un texto tiene más de 500 palabras, se almacena en un único chunk sin fragmentarse.
 * Esto sucede porque al verificar si el último chunk + las palabras del nuevo texto supera el límite,
 * se crea un nuevo chunk que incluye todas las palabras nuevas, incluso si son más de 500.
 * 
 * La solución sería fragmentar el nuevo chunk al crearlo, dividiendo el texto en bloques de 500 palabras
 * más un pequeño margen de palabras adicionales para manejar el exceso.
 */

export default class TextChunker {
    chunks: Array<Chunk> = []
    private static readonly MAX_WORDS = 500

    constructor() { }

    countWords(text: string): number {
        return (text.match(/\b\w+\b/g) || []).length
    }

    pushComponentText(component: BaseComponent) {

        const text = component.innerText

        if (!text) return

        const wordCount = this.countWords(text)

        let lastChunk = this.chunks[this.chunks.length - 1]

        if (!lastChunk) {
            lastChunk = new Chunk(0, [], [])
            this.chunks.push(lastChunk)
        }

        const lastChunkWordCount = lastChunk.total_words

        if (lastChunkWordCount + wordCount <= TextChunker.MAX_WORDS) {
            lastChunk.parts.push(component)
            lastChunk.total_words += wordCount
            lastChunk.parts_texts.push(text)
        } else {
            /**
             * @here fragmentar aca en caso de que `text` tenga mas de 500 palabras. 
             */
            this.chunks.push(new Chunk(wordCount, [component], [text]))
        }
    }

}