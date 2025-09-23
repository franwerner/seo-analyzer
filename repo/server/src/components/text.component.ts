import VDomContext from "@/context/vDom.context"
import BaseComponent from "./base.component"

interface TextComponentProps {
    text: string
    vDomContext: VDomContext
    parent: BaseComponent
}

class TextComponent {
    text: string
    vDomContext: VDomContext
    parent: BaseComponent
    constructor({
        text,
        vDomContext,
        parent
    }: TextComponentProps) {
        this.text = TextComponent.normalizeText(text)
        this.vDomContext = vDomContext
        this.parent = parent
    }

    contextualizeVDom() {
        if (this.parent.tag === "script") return
        this.vDomContext.texts.push({
            text: this.text,
            traceId: this.parent.traceId,
            tag: this.parent.tag,
        })
    }

    static normalizeText(text: string) {
        return text.replace(/\s+/g, " ").trim()
    }

}
export default TextComponent