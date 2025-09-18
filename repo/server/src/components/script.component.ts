import BaseComponent, { BaseComponentProps } from "./base.component";
import TextComponent from "./text.component";


class ScriptComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)

        if (this.hasSchema("FAQPage")) {
            this.domContext.schemas.faqSchema = this
        }

        if (this.hasSchema("LocalBusiness")) {
            this.domContext.schemas.localBusinessSchema = this
            console.log("LocalBusiness")
        }
    }


    protected shouldIgnore() {
        const isFaqSchema = this.hasSchema("FAQPage")
        const isLocalBusinessSchema = this.hasSchema("LocalBusiness")
        const hasNotSchema = !(isFaqSchema || isLocalBusinessSchema)
        return hasNotSchema
    }

    private hasSchema(type: string) {
        const isSchema = this.attributes.type === "application/ld+json"
        const firstChildren = this.children[0]
        if (isSchema && firstChildren instanceof TextComponent) {
            const parse = JSON.parse(firstChildren.text)
            const schema = parse["@type"]
            return schema == type
        }
    }

}

export default ScriptComponent