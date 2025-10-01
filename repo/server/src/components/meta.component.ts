import BaseComponent, { BaseComponentProps } from "./base.component"

export default class MetaComponent extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom(): void {
        super.contextualizeVDom()
        if (this.attributes.name == "description") {
            this.vDomContext.metaDescription.push(this)
        }
    }
}