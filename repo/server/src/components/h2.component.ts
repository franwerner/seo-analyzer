import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H2Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
        const domContext = props.domContext
        domContext.h2.push(this)
    }
}
