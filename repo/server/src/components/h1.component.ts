import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H1Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }


    contextualizeVDom() {
        const vDomContext = this.vDomContext
        vDomContext.h1.push(this)
    }


}   