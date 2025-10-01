import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H3Component extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom(): void {
        super.contextualizeVDom()
        this.vDomContext.headings.h3.push(this)
    }
}