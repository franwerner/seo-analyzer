import BaseComponent from "@/components/base.component";
import BaseValidatableComponent from "@/components/baseValidatable.component";
import ValidationUtility from "@/utils/validation.util";

export default class ComponentTreeValidation extends ValidationUtility {

    constructor(
        private root: BaseComponent
    ) { super() }

    async validate() {
        const traverse = async (component: BaseComponent) => {
            const validate = component instanceof BaseValidatableComponent ? await component.validate() : undefined
            await Promise.all(
                component.children
                    .filter(child => child instanceof BaseComponent)
                    .map(child => traverse(child))
            )
            if (validate) this.addIssue(validate)
        }
        await traverse(this.root)
    }
}
