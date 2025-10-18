import { z, ZodError } from "zod"
import OutputDTOError from "../errors/OutputDTO.error"

export default function validateOutputDTO<T>(schema: z.ZodType<T>) {
    return (data: T) => {
        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof ZodError) {
                throw new OutputDTOError(error.message)
            }
            throw error
        }
    }

}