import BaseComponent, { BaseComponentProps } from "./base.component";

export default class H1Component extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
        const domContext = props.domContext
        domContext.h1.push(this)
    }


}   