import BaseComponent, { type BaseComponentProps } from "./base.component";

class ImgComponent extends BaseComponent {
    static pickableAttributes = ["src", "alt"]
    constructor(props: BaseComponentProps) {
        super(props)
    }
}

export default ImgComponent