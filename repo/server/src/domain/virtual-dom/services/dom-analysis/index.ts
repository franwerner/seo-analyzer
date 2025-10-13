import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import { VirtualDomSnapshot } from "@/domain/virtual-dom/virtualDom.entity";
import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationType, { ValidationsType } from "../../types/ValidationType.enum";
import ComponentTreeValidation, { ValidationsTypeForComponentTree } from "./validations/componentTree.validation";
import SchemeValidaton from "./validations/schemes.validation";
import SemanticValidation from "./validations/semantic.validation";
import SpellingValidation from "./validations/spelling.validation";
import StructureValidation from "./validations/structure.validation";
import { VirtualDomAnalysisError, VirtualDomAnalysisInProgressError } from "../../errors";

export enum AnalyzeStatus {
    Analyzing = "analyzing",
    Idle = "idle"
}

export default class DomAnalysis {

    private static readonly VALIDATIONS_FOR_COMPONENT_TREE: Array<ValidationsTypeForComponentTree> = [ValidationType.SEMANTIC, ValidationType.STRUCTURE, ValidationType.RESOURCE]

    analyzeStatus: AnalyzeStatus = AnalyzeStatus.Idle


    constructor(
        private openAi: OpenAi
    ) { }

    setStatus(status: AnalyzeStatus) {
        this.analyzeStatus = status
    }

    throwIfAnalyzing() {
        if (this.analyzeStatus === AnalyzeStatus.Analyzing)
            throw new VirtualDomAnalysisInProgressError()
    }


    private static async validationInstances(instances: Array<ValidationUtility>) {
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
        return validation
    }

    async runAnalysis({
        snapshot,
        pageSummary,
        validationsSelected,
    }: {
        snapshot: VirtualDomSnapshot,
        pageSummary: string,
        validationsSelected: ValidationsType,
    }) {

        this.throwIfAnalyzing()

        this.setStatus(AnalyzeStatus.Analyzing)

        const { root, vDomContext, htmlStructure, htmlSemantic } = snapshot

        const validationMap = {
            [ValidationType.SEMANTIC]: () => new SemanticValidation(this.openAi, htmlSemantic, pageSummary, vDomContext),
            [ValidationType.STRUCTURE]: () => new StructureValidation(this.openAi, vDomContext, htmlStructure),
            [ValidationType.SPELLING]: () => new SpellingValidation(this.openAi, vDomContext),
            [ValidationType.SCHEME]: () => new SchemeValidaton(this.openAi, vDomContext, pageSummary, root),
        }

        try {
            const validationInstances: Array<ValidationUtility> = []

            if (DomAnalysis.VALIDATIONS_FOR_COMPONENT_TREE.some(v => validationsSelected[v])) {
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

            return await DomAnalysis.validationInstances(validationInstances)
        } catch (error) {
            throw new VirtualDomAnalysisError(error)
        } finally {
            this.setStatus(AnalyzeStatus.Idle)
        }
    }
}