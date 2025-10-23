import z from "zod"
import DTOError from "../errors/DTO.error"

export default function ValidateDTO<T>(schema: z.ZodType<T, any, any>, data: any) {

    const { success, error, data: validatedData } = schema.safeParse(data)
    if (!success || !validatedData) throw new DTOError(error)
    return validatedData
}