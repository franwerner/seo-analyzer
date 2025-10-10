import { Validation } from "@/domain/virtual-dom/types/Validation.interface";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import { VirtualDomSnapshot } from "@/domain/virtual-dom/virtualDom.entity";
import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationType, { ValidationsType } from "../../types/ValidationType.enum";
import ComponentTreeValidation, { ValidationsTypeForComponentTree } from "./validations/componentTree.validation";
import SchemeValidaton from "./validations/schemes.validation";
import SemanticValidation from "./validations/semantic.validation";
import SpellingValidation from "./validations/spelling.validation";
import StructureValidation from "./validations/structure.validation";

type ValidationWithTokens = Required<Validation>

export default class DomValidator {
    private static readonly VALIDATIONS_FOR_COMPONENT_TREE: Array<ValidationsTypeForComponentTree> = [ValidationType.SEMANTIC, ValidationType.STRUCTURE, ValidationType.RESOURCE]
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

    private async validationInstaces(instances: Array<ValidationUtility>) {
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
        pageSummary,
        validationsSelected
    }: {
        snapshot: VirtualDomSnapshot,
        pageSummary: string,
        validationsSelected: ValidationsType
    }) {
        const { root, vDomContext, htmlStructure, htmlSemantic } = snapshot

        const validationMap = {
            [ValidationType.SEMANTIC]: () => new SemanticValidation(this.openAi, htmlSemantic, pageSummary, vDomContext),
            [ValidationType.STRUCTURE]: () => new StructureValidation(this.openAi, vDomContext, htmlStructure),
            [ValidationType.SPELLING]: () => new SpellingValidation(this.openAi, vDomContext),
            [ValidationType.SCHEME]: () => new SchemeValidaton(this.openAi, vDomContext, pageSummary, root),
        }

        const validationInstances: Array<ValidationUtility> = []

        if (DomValidator.VALIDATIONS_FOR_COMPONENT_TREE.some(v => validationsSelected[v])) {
            validationInstances.push(new ComponentTreeValidation(root, validationsSelected))
        }

        const recolectedValidators = Object.keys(validationsSelected).map(v => {
            const key = v as keyof typeof validationMap
            if (!validationsSelected[key]) return
            if (key in validationMap) {
                return validationMap[key]()
            }
        }).filter(v => v !== undefined)

        validationInstances.push(...recolectedValidators)

        return await this.validationInstaces(validationInstances)
    }
}