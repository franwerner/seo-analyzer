import { SchemeOptions } from "@seo-analyzer/common";

declare function validateDTO<I = any, O = any>(
    options: SchemeOptions<I, O>
): MethodDecorator;

export { validateDTO };