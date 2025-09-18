import { DomContext } from "@/helper/domContext.helper";
import { Issue } from "@/schemas/issues.schema";

const H1Rule = (h1: DomContext["h1"]): Issue | void => {
    if (h1.length > 1) {
        return {
            message: "The webpage contains more than one h1 element",
            tag: "H1",
            traceIds: h1.map(h1 => h1.traceId)
        }
    } else if (h1.length === 0) {
        return {
            message: "No h1 found",
            tag: "H1",
            traceIds: ["-0"]
        }
    }
}

const H2Rule = (h2: DomContext["h2"]): Issue | void => {
    if (h2.length > 10) {
        return {
            message: "The webpage contains more than 10 h2 elements",
            tag: "h2",
            traceIds: h2.map(h2 => h2.traceId)
        }
    }
}

export default function HeadingsRule(context: DomContext): Array<Issue> {
    const rules = [
        H1Rule(context.h1),
        H2Rule(context.h2),
    ]
    return rules.filter(issue => issue !== undefined)
}