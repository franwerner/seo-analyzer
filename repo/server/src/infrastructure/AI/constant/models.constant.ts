
export abstract class Model {
    abstract name: string
    abstract pricing: {
        input: number,
        output: number
    }
}

export class GPT5MiniModel extends Model {
    name = "gpt-5-mini"
    pricing = {
        input: 0.250,
        output: 2.0
    }
}

