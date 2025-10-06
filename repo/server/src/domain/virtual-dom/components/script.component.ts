import BaseComponent, { BaseComponentProps } from "./base.component";


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
        if (isSchema && this.innerText.value) {
            const parse = JSON.parse(this.innerText.value)
            const schema = parse["@type"]
            return schema == type
        }
    }
}

export default ScriptComponent