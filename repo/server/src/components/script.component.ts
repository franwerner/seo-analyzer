import BaseComponent, { BaseComponentProps, DomContext } from "./base.component";


class ScriptComponent extends BaseComponent {
    constructor(props: BaseComponentProps) {
        super(props)
    }

    canBeUsedInBranch(domContext: DomContext) {
        const hasScriptSchema = domContext.hasScriptSchema
        const isScriptSchema = this.attributes.type === "application/ld+json"
        const canBeUsed = isScriptSchema && !hasScriptSchema
        if (canBeUsed) {
            domContext.hasScriptSchema = true
        }
        return canBeUsed
    }
}

export default ScriptComponent