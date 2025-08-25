import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";

class LinkComponent extends BaseComponent {
    static pickableAttributes = ["hreflang", "rel", "media", "href"];

    constructor(props: BaseComponentProps) {
        super(props)
    }

}

export default LinkComponent