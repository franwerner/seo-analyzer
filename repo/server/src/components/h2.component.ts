import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H2Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom() {
        super.contextualizeVDom()
        const vDomContext = this.vDomContext
        vDomContext.headings.h2.push(this)
    }
}
