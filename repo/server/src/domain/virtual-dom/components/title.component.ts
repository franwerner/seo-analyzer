import BaseComponent, { BaseComponentProps } from "./base.component";

export default class TitleComponent extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom(): void {
        super.contextualizeVDom()
        this.vDomContext.title.push(this)
    }

}