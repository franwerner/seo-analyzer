import BaseComponent, { type BaseComponentProps } from "./base.component";

class MetaComponent extends BaseComponent {
    static pickableAttributes: "*" = "*"
    constructor(props: BaseComponentProps) {
        super(props)
    }
}
export default MetaComponent