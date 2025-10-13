import { z } from "zod"

export default function ValidateDTO<T>(schema: z.ZodType<T>) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const data = args[0];
            const parsed = schema.parse(data)
            return await original.apply(this, [parsed])
        }
    }
}