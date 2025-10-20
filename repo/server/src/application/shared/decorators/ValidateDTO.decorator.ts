import { SchemeOptions } from "@seo-analyzer/common";
import createDTOValidator from "../utils/createDTOValidator.utils";
import InputDTOError from "../errors/InputDTO.error";
import OutputDTOError from "../errors/OutputDTO.error";

/**
 * Decorator para validar DTOs de entrada y salida.
 *
 * @param options.input - Esquema Zod para validar la entrada.
 * @param options.output - Esquema Zod para validar la salida.
 * 
 * @note
 * Se debe pasar explícitamente `null` si NO se desea validación .
 * Esto ayuda a evitar que el desarrollador olvide validar en caso de que estuviera planeada la entrada o salida..
 */

export function validateDTO<I, O>({ input, output }: SchemeOptions<I, O>) {

    if (input === undefined) {
        console.warn(new Error("[ValidateDTO] No input validation schema has been specified."));
    }

    if (output === undefined) {
        console.warn(new Error("[ValidateDTO] No output validation schema has been specified."));
    }

    const fnInput = input ? createDTOValidator(input, InputDTOError) : null
    const fnOutput = output ? createDTOValidator(output, OutputDTOError) : null

    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const data = args[0];
            const parsedInput = fnInput ? fnInput(data) : data
            const res = await original.apply(this, [parsedInput])
            const parsedOutput = fnOutput ? fnOutput(res) : res
            return parsedOutput
        }
    }
}