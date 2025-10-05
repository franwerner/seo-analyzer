import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import OpenAi from "@/infrastructure/AI/openAi.service";
import { Validation } from "@/shared/types/Validation.interface";
import ErrorHandler from "@/shared/utils/errorHandler.utils";
import { VirtualDomSnapshot } from "../../entities/virtualDom.entity";
import SemanticValidation from "./validations/semantic.validation";

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
        context
    }: {
        snapshot: VirtualDomSnapshot,
        context: string
    }) {
        const { root, vDomContext, htmlStructure } = snapshot
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