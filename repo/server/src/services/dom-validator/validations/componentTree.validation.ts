import BaseComponent from "@/components/base.component";
import ValidationUtility from "@/utils/validation.util";

export default class ComponentTreeValidation extends ValidationUtility {

    constructor(
        private root: BaseComponent
    ) { super() }

    async validate() {
        const traverse = async (component: BaseComponent) => {
            const validate = await component.validate()
            await Promise.all(
                component.children
                    .filter(child => child instanceof BaseComponent)
                    .map(child => traverse(child))
            )
            this.addIssue(validate)
        }
        await traverse(this.root)
    }
}
