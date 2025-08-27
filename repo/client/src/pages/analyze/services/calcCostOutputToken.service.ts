

export default function calcCostOutputToken(output: number) {
    const outputCost = (output / 1_000_000) * 2.0;
    return outputCost
}
