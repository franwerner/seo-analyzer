import BaseComponent, { BaseComponentProps } from "./base.component";
import TextComponent from "./text.component";


class ScriptComponent extends BaseComponent {


    constructor(props: BaseComponentProps) {
        super(props)
    }


    contextualizeVDom() {
        super.contextualizeVDom()
        if (this.hasSchema("FAQPage")) {
            this.vDomContext.schemas.faqPage = this
        }

        if (this.hasSchema("LocalBusiness")) {
            this.vDomContext.schemas.localBusiness = this
        }
    }

    private hasSchema(type: "FAQPage" | "LocalBusiness") {
        const isSchema = this.attributes.type === "application/ld+json"
        const firstChildren = this.getOrThrowChildren()[0]
        /**
         * Se accede al primer hijo porque el innerText no se genera para los scripts.
         */
        if (isSchema && firstChildren instanceof TextComponent) {
            const parse = JSON.parse(firstChildren.text)
            const schema = parse["@type"]
            return schema == type
        }
    }
}

export default ScriptComponent