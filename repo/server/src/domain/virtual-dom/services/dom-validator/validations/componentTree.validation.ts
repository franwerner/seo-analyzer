import BaseComponent from "@/domain/virtual-dom/components/base.component";
import BaseValidatableComponent from "@/domain/virtual-dom/components/baseValidatable.component";
import ValidationType, { ValidationsType } from "@/domain/virtual-dom/types/ValidationType.enum";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";

export type ValidationsTypeForComponentTree = ValidationType.SEMANTIC | ValidationType.STRUCTURE | ValidationType.RESOURCE

const validators: Record<ValidationsTypeForComponentTree, `validate${Capitalize<ValidationsTypeForComponentTree>}`> = {
    semantic: "validateSemantic",
    structure: "validateStructure",
    resource: "validateResource"
}


export default class ComponentTreeValidation extends ValidationUtility {

    constructor(
        private root: BaseComponent,
        private validationSelected: ValidationsType
    ) { super() }

    async validate() {
        const traverse = async (component: BaseComponent) => {

            if (component instanceof BaseValidatableComponent) {
                for (const key in validators) {
                    const k = key as ValidationsTypeForComponentTree
                    if (this.validationSelected[k] && component[validators[k]]) {
                        const validatorReturn = component[validators[k]]?.()
                        if (validatorReturn instanceof Promise) {
                            const validation = await validatorReturn
                            if (validation) this.addIssue(validation)
                        }
                        else if (validatorReturn) {
                            this.addIssue(validatorReturn)
                        }
                    }
                }
            }

            await Promise.all(
                component.getOrThrowChildren()
                    .filter(child => child instanceof BaseComponent)
                    .map(child => traverse(child))
            )
        }
        await traverse(this.root)
    }
}
