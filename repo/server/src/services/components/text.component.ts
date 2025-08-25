class TextComponent {
    text: string
    constructor(text: string) {
        this.text = TextComponent.normalizeText(text)
    }

    static normalizeText(text: string) {
        return text.replace(/\s+/g, " ").trim()
    }

}
export default TextComponent