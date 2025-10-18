import z from "zod";
import { SchemeOptions } from "./SchemeOptions.interface";

export type InferDTO<T extends SchemeOptions<any, any>> = {
    [K in keyof T]:
    T[K] extends null ? null :
    T[K] extends z.ZodTypeAny ? z.infer<T[K]> :
    never;
};
