import { Issue } from "../types/Issue.interface"
import ValidationType from "../types/ValidationType.enum"

const issues: Array<Issue> = [
    {
        message: 'The webpage contains more than 10 h2 elements',
        tag: 'h2',
        traceIds: [
            '-1461494969', '836850906',
            '-525351214', '2064288445',
            '562530740', '-1172126245',
            '264907832', '-1804640169',
            '-1240139451', '766620970',
            '4320030', '-889884652',
            '631752437'
        ],
        type: ValidationType.STRUCTURE
    },
    {
        message: "Missing semantic landmark for the page's top section.",
        tag: 'header',
        traceIds: ["1"],
        type: ValidationType.STRUCTURE
    },
    {
        message: "Missing semantic landmark for the page's bottom section.",
        tag: 'footer',
        traceIds: ["-1461494969"],
        type: ValidationType.STRUCTURE
    },
    {
        message: "The webpage contains more than 10 h3 elements",
        tag: 'h3',
        traceIds: ["-1461494969"],
        type: ValidationType.STRUCTURE
    }
]
export default {
    issues,
    tokens: {
        input: 10209,
        output: 4434
    },
    model: "gpt-test"
}
