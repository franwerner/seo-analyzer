import BaseComponent, { BaseComponentProps } from "./base.component";

export default class LinkComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    protected shouldIgnore(): boolean | undefined {
        const ignore = this.attributes.rel !== "canonical"
        return ignore
    }
}
