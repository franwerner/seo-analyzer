import { Issue } from "@/schemas/issues.schema"
import { Tokens } from "@/types/Tokens.interface"
import { Validation } from "@/types/Validation.interface"

/**
 * Esta class se encarga de agrupar los issues y tokens.
 * Abstrayendo del como se almacenan, permitiendo gestionar facilmente
 * los issues y tokens de manera centralizada.
 */

export default abstract class ValidationUtility {

    tokens: Tokens = {
        input: 0,
        output: 0
    }
    issues: Array<Issue> = []


    static mergeValidations(validations: Array<Validation>): Required<Validation> {
        return validations.reduce((acc, current) => {
            acc.issues.push(...current.issues)
            if (current.tokens) {
                const tokens = acc.tokens as Tokens
                tokens.input += (current.tokens.input || 0)
                tokens.output += (current.tokens.output || 0)
            }
            return acc
        }, {
            issues: [],
            tokens: {
                input: 0,
                output: 0
            }
        }) as Required<Validation>
    }

    addIssue(issue: Issue | Array<Issue>) {
        if (Array.isArray(issue)) {
            this.issues.push(...issue)
        } else {
            this.issues.push(issue)
        }
    }

    getValidation() {
        return {
            issues: this.issues,
            tokens: this.tokens
        }
    }

    addTokens(tokens: Tokens) {
        this.tokens.input += tokens.input
        this.tokens.output += tokens.output
    }

}