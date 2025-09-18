import { Issues } from "../schemas/issues.schema"
import BaseComponent, { BaseComponentProps } from "./base.component"

export class ImgComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    async validate(): Promise<Issues> {
        if (!this.attributes.alt) return [{
            message: "Image without alt",
            tag: this.tag,
            traceIds: [this.traceId]
        }]
        return []
    }
}