import z, { ZodError } from "zod"
import InputDTOError from "../errors/InputDTO.error"
import OutputDTOError from "../errors/OutputDTO.error"

export default function createDTOValidator<T>(schema: z.ZodType<T> | null, err: typeof InputDTOError | typeof OutputDTOError) {
    if (!schema) return null
    return (data: T) => {
        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof ZodError) throw new err(error.message)
            throw error
        }
    }
}   