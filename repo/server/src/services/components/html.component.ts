import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";


class HTMLComponent extends BaseComponent {
    static pickableAttributes = ["lang"];

    constructor(props: BaseComponentProps) {
        super(props)
    }
}

export default HTMLComponent