import BaseComponent from "@/domain/virtual-dom/components/base.component";
import BaseValidatableComponent from "@/domain/virtual-dom/components/baseValidatable.component";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import { ValidationsType, ValidationTypeEnum } from "@packages/common";

export type ValidationsTypeForComponentTree = ValidationTypeEnum.SEMANTIC | ValidationTypeEnum.STRUCTURE | ValidationTypeEnum.RESOURCE

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


    private generateChildrenPromises(component: BaseComponent, traverse: (component: BaseComponent) => Promise<void>) {
        const childrenPromises = component.getOrThrowChildren()
            .filter(child => child instanceof BaseComponent)
            .map(child => traverse(child))
        return childrenPromises
    }

    async validate() {
        const traverse = async (component: BaseComponent) => {

            const childrenPromises = this.generateChildrenPromises(component, traverse)

            if (component instanceof BaseValidatableComponent) {
                const getValidatorsSelected = Object.keys(validators)
                    .filter((key) => key in this.validationSelected)
                const parentPromises = getValidatorsSelected
                    .map(async key => {
                        const k = key as ValidationsTypeForComponentTree
                        const validator = component[validators[k]]
                        if (!validator) return
                        const res = await validator.bind(component)()
                        if (res) this.addIssue(res)
                    })
                await Promise.all([...parentPromises, ...childrenPromises])
            } else {
                await Promise.all(childrenPromises)
            }
        }

        await traverse(this.root)
    }
}
