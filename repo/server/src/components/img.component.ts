import BaseComponent, { BaseComponentProps } from "./base.component"
import { Issue } from "@/types/Issue.interface";

export class ImgComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    async validate(): Promise<Array<Issue>> {
        if (!this.attributes.alt) return [{
            message: "Image without alt",
            tag: this.tag,
            traceIds: [this.traceId]
        }]
        return []
    }
}