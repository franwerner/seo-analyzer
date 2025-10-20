import z from "zod"
import InputDTOError from "../errors/InputDTO.error"

export default function validateInputDTO<T>(schema: z.ZodType<T, any, any>, data: any) {

    const { success, error, data: validatedData } = schema.safeParse(data)
    if (!success || !validatedData) throw new InputDTOError(error)
    return validatedData
}