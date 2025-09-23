import BaseComponent, { BaseComponentProps } from "./base.component";
import TextComponent from "./text.component";


class ScriptComponent extends BaseComponent {

    schema: {
        FAQPage: boolean
        LocalBusiness: boolean
    } = {
            FAQPage: false,
            LocalBusiness: false
        }
    constructor(props: BaseComponentProps) {
        super(props)
    }

    setShouldIgnore() {
        const isFaqSchema = this.hasSchema("FAQPage")
        const isLocalBusinessSchema = this.hasSchema("LocalBusiness")
        const hasNotSchema = !(isFaqSchema || isLocalBusinessSchema)
        this.shouldIgnore = hasNotSchema
    }

    contextualizeVDom() {
        if (this.hasSchema("FAQPage")) {
            this.vDomContext.schemas.faqPage = this
        }

        if (this.hasSchema("LocalBusiness")) {
            this.vDomContext.schemas.localBusiness = this
        }
    }

    private hasSchema(type: "FAQPage" | "LocalBusiness") {
        if (this.schema[type]) return this.schema[type]
        const isSchema = this.attributes.type === "application/ld+json"
        const firstChildren = this.children[0]
        if (isSchema && firstChildren instanceof TextComponent) {
            const parse = JSON.parse(firstChildren.text)
            const schema = parse["@type"]
            return (this.schema[type] = schema == type)
        }
    }

}

export default ScriptComponent