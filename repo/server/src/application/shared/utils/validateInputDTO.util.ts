import { z, ZodError } from "zod"
import InputDTOError from "../errors/InputDTO.error"

export default function validateInputDTO<T>(schema: z.ZodType<T>) {
    return (data: T) => {
        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof ZodError) {
                throw new InputDTOError(error.message)
            }
            throw error
        }
    }

}