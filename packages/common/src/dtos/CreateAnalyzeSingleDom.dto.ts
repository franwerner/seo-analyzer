import { InferDTO } from "@/types/InferDTO.type"
import { ValidationTypeEnum } from "../types/ValidationType.enum"
import { z } from "zod"

const validationKeys = Object.keys(ValidationTypeEnum) as Array<ValidationTypeEnum>

const validationSelectedScheme = z.object(validationKeys.reduce((acc, key) => {
    const keyNormalized = key.toLowerCase() as ValidationTypeEnum
    acc[keyNormalized] = z.boolean().optional()
    return acc
}, {} as Record<ValidationTypeEnum, z.ZodOptional<z.ZodBoolean>>)
)

const input = z.object({
    virtualDomId: z.number(),
    virtualWebId: z.number(),
    validationsSelected: validationSelectedScheme.strip()
})

const output = null

export const createAnalyzeSingleDomScheme = {
    input,
    output
}

export type CreateAnalyzeSingleDomDTO = InferDTO<typeof createAnalyzeSingleDomScheme>