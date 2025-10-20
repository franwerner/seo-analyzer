import z from "zod"

export enum ValidationTypeEnum {
    SCHEME = "scheme",
    SEMANTIC = "semantic",
    SPELLING = "spelling",
    RESOURCE = "resource",
    STRUCTURE = "structure"
}

export const validationTypeEnumScheme = z.enum(["scheme", "semantic", "spelling", "resource", "structure"])

const validationKeys = Object.keys(ValidationTypeEnum) as Array<ValidationTypeEnum>

export const validationsTypeScheme = z.object(validationKeys.reduce((acc, key) => {
    const keyNormalized = key.toLowerCase() as ValidationTypeEnum
    acc[keyNormalized] = z.boolean().optional()
    return acc
}, {} as Record<ValidationTypeEnum, z.ZodOptional<z.ZodBoolean>>)
)


export type ValidationsType = z.infer<typeof validationsTypeScheme>