import BaseComponent, { BaseComponentProps } from "./base.component";

export default class LinkComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    setShouldIgnore() {
        const ignore = this.attributes.rel !== "canonical"
        this.shouldIgnore = ignore
    }
}
