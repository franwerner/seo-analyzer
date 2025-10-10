import z from "zod"

const WordsSchema = z.object({
    words: z.array(z.string())
})

export default WordsSchema
