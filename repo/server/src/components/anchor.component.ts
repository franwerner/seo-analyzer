import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";
import TextComponent from "./text.component";
import { Issue } from "@/types/Issue.interface";

const notValidText = ["read more", "learn more", "see more"]

class AnchorComponent extends BaseComponent {

    text: {
        value: string
        containNotValidText: boolean
    } = {
            value: "",
            containNotValidText: false
        }

    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom() {
        if (!this.attributes.href || !this.getText().containNotValidText) return
        this.vDomContext.a.push(this)
    }


    hasBlackHoleHref() {
        const att = this.attributes
        const isBlackHoleHref = att.href?.includes("blackhole")
        return !!isBlackHoleHref
    }

    setShouldIgnore() {
        this.shouldIgnore = this.hasBlackHoleHref()
    }

    private async validateHref(): Promise<Issue | undefined> {
        const href = this.attributes.href
        if (!isValidHttpUrl(href) || this.hasBlackHoleHref()) return
        try {
            const res = await fetch(href, { method: "HEAD" })
            if ([404, 500, 504].includes(res.status)) throw ""
        } catch (error) {
            return {
                message: `${href} link broken`,
                traceIds: [this.traceId],
                tag: this.tag
            }
        }
    }

    private getText() {

        if (this.text.value) return this.text

        const recursiveText = (node: BaseComponent) => {
            return node.children.reduce((acc, child) => {
                if (child instanceof TextComponent) {
                    acc += child.text
                } else {
                    acc += recursiveText(child)
                }
                return acc
            }, "")
        }

        const text = recursiveText(this).replace(/\s+/g, " ").trim()

        const containsKeyword = notValidText.some(keyword => text.toLowerCase() == keyword)

        return this.text = {
            value: text,
            containNotValidText: containsKeyword
        }

    }

    private async validateText(): Promise<Issue | undefined> {

        const {
            value,
            containNotValidText
        } = this.getText()

        if (containNotValidText) {
            return {
                message: `the text "${value}" is not very descriptive`,
                traceIds: [this.traceId],
                tag: this.tag
            }
        }
    }

    async validate(): Promise<Array<Issue>> {

        if (!this.attributes.href) return [{
            message: "Anchor without href",
            traceIds: [this.traceId],
            tag: this.tag
        }]

        const validations = await Promise.all([
            this.validateHref(),
            this.validateText()
        ])

        return validations.filter(issue => issue !== undefined)
    }

}

export default AnchorComponent
