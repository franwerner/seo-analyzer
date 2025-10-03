import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H1Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom() {
        super.contextualizeVDom()
        const vDomContext = this.vDomContext
        vDomContext.headings.h1.push(this)
    }


}       