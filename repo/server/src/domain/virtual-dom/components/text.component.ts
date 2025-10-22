import { Parent } from "./base.component"

interface TextComponentProps {
    text: string
    parent: Parent
}

class TextComponent {
    text: string
    parent: Parent
    constructor({
        text,
        parent
    }: TextComponentProps) {
        this.text = TextComponent.normalizeText(text)
        this.parent = parent
    }

    static normalizeText(text: string) {
        return text.replace(/\s+/g, " ").toLowerCase()
    }

}
export default TextComponent