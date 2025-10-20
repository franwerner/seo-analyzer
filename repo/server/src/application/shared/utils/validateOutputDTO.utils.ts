import z from "zod"
import OutputDTOError from "../errors/OutputDTO.error"

export default function validateOutputDTO<T>(schema: z.ZodType<T>, data: any) {

    const { success, error, data: validatedData } = schema.safeParse(data)
    if (!success || !validatedData) throw new OutputDTOError(error)
    return validatedData
}