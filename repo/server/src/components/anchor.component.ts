import { Issue } from "@/schemas/issues.schema";
import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";
import BaseValidatableComponent from "./baseValidatable.component";
import TextComponent from "./text.component";

const notValidText = ["read more", "learn more", "see more"]

class AnchorComponent extends BaseValidatableComponent {

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
        super.contextualizeVDom()
        if (!this.attributes.href || !this.getText().containNotValidText) return
        this.vDomContext.a.push(this)
    }


    hasBlackHoleHref() {
        const att = this.attributes
        const isBlackHoleHref = att.href?.includes("blackhole")
        return !!isBlackHoleHref
    }

    private async validateHref() {
        const href = this.attributes.href
        if (!isValidHttpUrl(href) || this.hasBlackHoleHref()) return
        try {
            const res = await fetch(href, { method: "HEAD" })
            if ([404, 500, 504].includes(res.status)) throw ""
        } catch (error) {
            return {
                message: `${href} link broken`,
                traceId: this.traceId,
                tag: this.tag,
                type: "general"
            } satisfies Issue
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

    private async validateText() {

        const {
            value,
            containNotValidText
        } = this.getText()

        if (containNotValidText) {
            return {
                message: `the text "${value}" is not very descriptive`,
                traceId: this.traceId,
                tag: this.tag,
                type: "general"
            } satisfies Issue
        }
    }

    async validate() {

        if (!this.attributes.href) return {
            message: "Anchor without href",
            traceId: this.traceId,
            tag: this.tag,
            type: "general"
        } satisfies Issue

        const validations = await Promise.all([
            this.validateHref(),
            this.validateText()
        ])

        return validations.filter(issue => issue !== undefined)
    }

}

export default AnchorComponent
