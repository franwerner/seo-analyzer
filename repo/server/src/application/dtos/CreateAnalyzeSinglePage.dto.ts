import ValidationType from "@/domain/virtual-dom/types/ValidationType.enum"
import { z } from "zod"

const validationKeys = Object.keys(ValidationType) as Array<ValidationType>

const validationSelectedScheme = z.object(validationKeys.reduce((acc, key) => {
    const keyNormalized = key.toLowerCase() as ValidationType
    acc[keyNormalized] = z.boolean().optional()
    return acc
}, {} as Record<ValidationType, z.ZodOptional<z.ZodBoolean>>)
)

const createAnalyzeSinglePageScheme = z.object({
    virtualDomId: z.number(),
    virtualWebId: z.number(),
    validationsSelected: validationSelectedScheme
})

export default createAnalyzeSinglePageScheme

export type CreateAnalyzeSinglePageDto = z.infer<typeof createAnalyzeSinglePageScheme>
