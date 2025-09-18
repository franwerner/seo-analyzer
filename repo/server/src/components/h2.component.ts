import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H2Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
        const vDomContext = props.vDomContext
        vDomContext.h2.push(this)
    }
}
