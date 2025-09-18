import BaseComponent from "@/components/base.component";
import { generalPrompt } from "@/constants/assistantPrompt.constant";
import { DomContext } from "@/helper/domContext.helper";
import { Issue, Issues } from "@/schemas/issues.schema";
import ErrorHandler from "@/utils/errorHandler.utils";
import OpenAi from "../openAi.service";
import HeadingsRule from "./rules/headings.rule";
import ScriptSchemasRule from "./rules/scriptSchemas.rule";
import { OpenAiOutput } from "@/schemas/openAiOutput.schema";

export interface Validations {
    issues: Issues,
    tokens: { input: number, output: number }
}

export default class DomValidator {
    validations: Array<Validations> = []
    constructor(
        private openAi: OpenAi
    ) { }

    async localValidation(root: BaseComponent): Promise<Issues> {
        const traverse = async (component: BaseComponent): Promise<Issues> => {
            const validate = await component.validate()
            const childIssues = await Promise.all(
                component.children
                    .filter(child => child instanceof BaseComponent)
                    .map(child => traverse(child))
            )
            return [...validate, ...childIssues.flat()]
        }
        return traverse(root)
    }

    async openAiValidation(html: string) {
        return await this.openAi.generateIssues(html, generalPrompt)
    }

    getValidations() {
        if (this.validations.length == 0) throw new ErrorHandler({
            message: "No validations found",
            status_code: 404
        })
        return this.validations
    }

    setValidation(validation: Validations) {
        this.validations.push(validation)
        if (this.validations.length > 10) {
            this.validations.shift()
        }
    }

    private groupByErrorType(issues: Issues): Issues {
        const group = issues.reduce((acc, issue) => {
            const key = issue.message + issue.tag
            /**
             * Hacemos la union de `key` para evitar que agrupen errores con un mismo mensajes pero de diferente tipo de tag
             */
            const current = acc[key]
            if (current) {
                current.traceIds.push(...issue.traceIds)
            } else {
                acc[key] = issue
            }
            return acc
        }, {} as Record<string, Issue>)
        return Object.values(group)
    }

    async run({
        root,
        html,
        domContext
    }: {
        root: BaseComponent,
        html: string,
        domContext: DomContext
    }) {
        const v = this.localValidation(root)
        const c = ScriptSchemasRule({
            context: domContext,
            openAi: this.openAi,
            html
        })
        const {
            issues,
            tokens
        } = await this.openAiValidation(html)
        const validateIssues = await v
        const schemas = await ScriptSchemasRule({
            context: domContext,
            openAi: this.openAi,
            html
        })

        const headings = HeadingsRule(domContext)

        const allTokens = [
            tokens,
            schemas.tokens
        ].reduce((acc, token) => {
            return {
                input: acc.input + token.input,
                output: acc.output + token.output
            }
        })

        const currentValidation = {
            issues: this.groupByErrorType([...validateIssues, ...headings, ...schemas.issues, ...issues]),
            tokens: allTokens
        }
        this.setValidation(currentValidation)
        return currentValidation
    }
}