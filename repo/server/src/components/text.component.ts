import BaseComponent from "./base.component"

interface TextComponentProps {
    text: string
    parent: BaseComponent
}

class TextComponent {
    text: string
    constructor({
        text,
        parent
    }: TextComponentProps) {
        this.text = TextComponent.normalizeText(text)
    }

    static normalizeText(text: string) {
        return text.replace(/\s+/g, " ").trim()
    }

}
export default TextComponent