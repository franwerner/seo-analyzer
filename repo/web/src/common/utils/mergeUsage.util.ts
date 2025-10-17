import { Usage } from "@packages/common";
export default function mergeUsage(...usages: (Usage | undefined)[]) {

    return usages.reduce<Usage>((acc, usage) => {
        if (!usage) return acc
        return {
            input: acc.input + usage.input,
            output: acc.output + usage.output,
            total: acc.total + usage.total
        }
    }, {
        input: 0,
        output: 0,
        total: 0
    })
}