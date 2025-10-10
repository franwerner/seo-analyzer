import { Issue } from "../types/Issue.interface"
import ValidationType from "../types/ValidationType.enum"
import { BaseComponentProps } from "./base.component"
import BaseValidatableComponent from "./baseValidatable.component"

export default class ImgComponent extends BaseValidatableComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    validateSemantic() {
        if (!this.attributes.alt) return {
            message: "Image without alt",
            tag: this.tag,
            traceIds: [this.traceId],
            type: ValidationType.SEMANTIC,
        } satisfies Issue
    }



}