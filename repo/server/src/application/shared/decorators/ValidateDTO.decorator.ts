import { z } from "zod"
import validateInputDTO from "../utils/validateInputDTO.util";
import validateOutputDTO from "../utils/validateOutputDTO.util";


type InputType<I> = z.ZodType<I> | null
type OutputType<O> = z.ZodType<O> | null

interface ValidateOptions<I, O> {
    input: InputType<I>
    output: OutputType<O>
}

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

export default function ValidateDTO<I, O>({ input, output }: ValidateOptions<I, O>) {

    if (input === undefined) {
        console.warn(new Error("[ValidateDTO] No input validation schema has been specified."));
    }

    if (output === undefined) {
        console.warn(new Error("[ValidateDTO] No output validation schema has been specified."));
    }

    const fnInput = input ? validateInputDTO(input) : null
    const fnOutput = output ? validateOutputDTO(output) : null

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