import { ValidationTypeEnum } from "@seo-analyzer/common";
import type { BaseComponentProps } from "./base.component";
import BaseValidatableComponent from "./baseValidatable.component";

class HTMLComponent extends BaseValidatableComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    validateSemantic() {
        if (!this.attributes.lang) {
            return {
                message: "No lang attribute found",
                tag: "html",
                traceIds: [this.traceId],
                type: ValidationTypeEnum.SEMANTIC
            }
        }
    }
}

export default HTMLComponent