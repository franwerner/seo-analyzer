import { Issue } from "@/infrastructure/schemas/issue.schema"
import { BaseComponentProps } from "./base.component"
import BaseValidatableComponent from "./baseValidatable.component"

export default class ImgComponent extends BaseValidatableComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    async validate() {
        if (!this.attributes.alt) return {
            message: "Image without alt",
            tag: this.tag,
            traceIds: [this.traceId],
            type: "semantic",
        } satisfies Issue
    }
}