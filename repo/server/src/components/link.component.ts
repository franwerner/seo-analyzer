import AnchorComponent from "./anchor.component";
import type { BaseComponentProps } from "./base.component";

class LinkComponent extends AnchorComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }
}

export default LinkComponent
