import ValidationType from "../types/ValidationType.enum";
import type { BaseComponentProps } from "./base.component";
import BaseValidatableComponent from "./baseValidatable.component";

class HTMLComponent extends BaseValidatableComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    validateSemantic() {
        console.log(this.attributes)
        if (!this.attributes.lang) {
            return {
                message: "No lang attribute found",
                tag: "html",
                traceIds: [this.traceId],
                type: ValidationType.SEMANTIC
            }
        }
    }
}

export default HTMLComponent