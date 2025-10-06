import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import OpenAi from "@/infrastructure/AI/openAi.service";
import { Validation } from "@/domain/virtual-dom/types/Validation.interface";
import { VirtualDomSnapshot } from "@/domain/virtual-dom/virtualDom.entity";
import SemanticValidation from "./validations/semantic.validation";
import SpellingValidation from "./validations/spelling.validation";
import StructureValidation from "./validations/structure.validation";
import ComponentTreeValidation from "./validations/componentTree.validation";

type ValidationWithTokens = Required<Validation>

export default class DomValidator {
    validations: Array<ValidationWithTokens> = []
    /**
     * Solo mantiene las validaciones que se realizan, no las que se obtienen tambien de la base de datos.
     */
    constructor(
        private openAi: OpenAi,
    ) { }

    getValidations() {
        return this.validations
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
        snapshot,
        pageSummary
    }: {
        snapshot: VirtualDomSnapshot,
        pageSummary: string
    }) {
        const { root, vDomContext, htmlStructure, htmlSemantic } = snapshot

        const validationInstaces = [
            new ComponentTreeValidation(root),
            // new ScriptSchemasValidation(this.openAi, vDomContext),
            new StructureValidation(this.openAi, vDomContext, htmlStructure),
            new SpellingValidation(this.openAi, vDomContext),
            new SemanticValidation(this.openAi, htmlSemantic, pageSummary, vDomContext)
        ]

        return await this.validationInstaces(validationInstaces)
    }
}