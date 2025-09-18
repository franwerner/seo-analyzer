import BaseComponent from "@/components/base.component";
import VDomContext from "@/context/vDom.context";
import { Validation } from "@/types/Validation.interface";
import ErrorHandler from "@/utils/errorHandler.utils";
import ValidationUtility from "@/utils/validation.util";
import OpenAi from "../openAi.service";
import ComponentTreeValidation from "./validations/componentTree.validation";
import HeadingsValidation from "./validations/headings.validation";
import ScriptSchemasValidation from "./validations/scriptSchemas.validation";
import HtmlAiValidation from "./validations/htmlAi.validation";
import { AnchorLinkValidation } from "./validations/anchorLink.validation";

type ValidationWithTokens = Required<Validation>

export default class DomValidator {
    validations: Array<ValidationWithTokens> = []
    constructor(
        private openAi: OpenAi
    ) { }

    getValidations() {
        if (this.validations.length == 0) throw new ErrorHandler({
            message: "No validations found",
            status_code: 404
        })
        return this.validations
    }

    setValidation(validation: ValidationWithTokens) {
        this.validations.push(validation)
        if (this.validations.length > 10) {
            this.validations.shift()
        }
    }

    async run({
        root,
        html,
        vDomContext
    }: {
        root: BaseComponent,
        html: string,
        vDomContext: VDomContext
    }) {
        const validationInstaces = [
            new ComponentTreeValidation(root),
            new HeadingsValidation(vDomContext),
            new ScriptSchemasValidation(this.openAi, html, vDomContext),
            new HtmlAiValidation(this.openAi, html),
            new AnchorLinkValidation(this.openAi, vDomContext)
        ]

        await Promise.all(validationInstaces.map(i => i.validate()))

        const mergedValidation = ValidationUtility.mergeValidations(validationInstaces.map(validation => validation.getValidation()))

        const groupByErrorType = ValidationUtility.groupByIssueType(mergedValidation.issues)

        const validation = {
            issues: groupByErrorType,
            tokens: mergedValidation.tokens
        }
        this.setValidation(validation)

        return validation

    }
}