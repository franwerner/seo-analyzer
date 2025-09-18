import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H1Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
        const vDomContext = props.vDomContext
        vDomContext.h1.push(this)
    }


}   