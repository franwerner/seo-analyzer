import BaseComponent from "@/domain/virtual-dom/components/base.component";
import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import { Validation } from "@/types/Validation.interface";
import ErrorHandler from "@/utils/errorHandler.utils";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import ComponentTreeValidation from "./validations/componentTree.validation";
import HeadingsValidation from "./validations/headings.validation";
import ScriptSchemasValidation from "./validations/scriptSchemas.validation";
import { AnchorLinkValidation } from "./validations/anchorLink.validation";
import SpellingValidation from "./validations/spelling.validation";
import { VirtualDomSnapshot } from "../../models/virtualDom.model";
import StructureValidation from "./validations/structure.validation";
import SemanticValidation from "./validations/semantic.validation";
import { WebSummary } from "@/types/WebSummary.interface";
import OpenAi from "@/services/openAi.service";

type ValidationWithTokens = Required<Validation>

export default class DomValidator {
    validations: Array<ValidationWithTokens> = []
    constructor(
        private openAi: OpenAi,
        private webSummary?: WebSummary | null
    ) { }

    getValidations() {
        if (this.validations.length == 0) throw new ErrorHandler({
            message: "No validations found",
            status_code: 404
        })
        return this.validations
    }

    updateWebSummaryContext(webSummary: WebSummary) {
        this.webSummary = webSummary
    }

    setValidation(validation: ValidationWithTokens) {
        this.validations.push(validation)
        if (this.validations.length > 10) {
            this.validations.shift()
        }
    }

    private async validationInstaces(instances: Array<any>) {//TIPAR DEPUES ACA.
        /**
         * Cosas a tener en cuenta en un futuro:
         * Los promise.all de cada validador si uno falla la promesa se rechaza por completo.
         * Hacer uso de promise.allSettled, para dar un informe de cual fallo y el motivo, esto evita que todo el conjunto se rechaze por completo.
         * Tal vez dar un feedback o categorizar las validaciones para que el cliente entienda de cual trata.
         */
        await Promise.all(instances.map(i => i.validate()))
        const mergedValidation = ValidationUtility.mergeValidations(instances.map(validation => validation.getValidation()))
        const groupByErrorType = ValidationUtility.groupByIssueType(mergedValidation.issues)
        const validation = {
            issues: groupByErrorType,
            tokens: mergedValidation.tokens
        }
        this.setValidation(validation)

        return validation
    }

    async runValidation({
        root,
        vDomContext,
        htmlStructure
    }: VirtualDomSnapshot) {
        const validationInstaces = [
            // new ComponentTreeValidation(root),
            // new HeadingsValidation(vDomContext),
            // new ScriptSchemasValidation(this.openAi, vDomContext),
            // new AnchorLinkValidation(this.openAi, vDomContext)
            // new StructureValidation(this.openAi, htmlStructure),
            // new SpellingValidation(vDomContext, this.openAi)
            new SemanticValidation(this.openAi, vDomContext)
        ]

        return await this.validationInstaces(validationInstaces)
    }
}