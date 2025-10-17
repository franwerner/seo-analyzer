import { ValidationTypeEnum } from "../types/ValidationType.enum"
import { z } from "zod"

const validationKeys = Object.keys(ValidationTypeEnum) as Array<ValidationTypeEnum>

const validationSelectedScheme = z.object(validationKeys.reduce((acc, key) => {
    const keyNormalized = key.toLowerCase() as ValidationTypeEnum
    acc[keyNormalized] = z.boolean().optional()
    return acc
}, {} as Record<ValidationTypeEnum, z.ZodOptional<z.ZodBoolean>>)
)

export const createAnalyzeSingleDomScheme = z.object({
    virtualDomId: z.number(),
    virtualWebId: z.number(),
    validationsSelected: validationSelectedScheme.strip()
})

export type CreateAnalyzeSingleDomDto = z.infer<typeof createAnalyzeSingleDomScheme>
