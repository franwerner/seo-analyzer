import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";
import TextComponent from "./text.component";
import { Issue } from "@/types/Issue.interface";

const keywordsNotValid = ["read more", "learn more", "see more"]

class AnchorComponent extends BaseComponent {

    text: string = ""
    constructor(props: BaseComponentProps) {
        super(props)
        if (this.isIgnored) return
        this.text = AnchorComponent.getText(this)
        const containsKeyword = keywordsNotValid.some(keyword => this.text.toLowerCase() == keyword)
        if (containsKeyword) return
        this.vDomContext.a.push(this)
    }

    protected shouldIgnore() {
        const att = this.attributes
        const isBlackHoleHref = att.href?.includes("blackhole")
        return isBlackHoleHref
    }

    private async validateHref(): Promise<Issue | undefined> {
        const href = this.attributes.href
        if (!isValidHttpUrl(href)) return
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

    private static getText(node: BaseComponent) {
        const text = node.children.reduce((acc, child) => {
            if (child instanceof TextComponent) {
                acc += child.text
            } else {
                acc += this.getText(child)
            }
            return acc
        }, "")
        return text.replace(/\s+/g, " ").trim()
    }

    private async validateText(): Promise<Issue | undefined> {

        const text = this.text
        const containsKeyword = keywordsNotValid.some(keyword => text.toLowerCase() == keyword)

        if (containsKeyword) {
            return {
                message: `the text "${text}" is not very descriptive`,
                traceIds: [this.traceId],
                tag: this.tag
            }
        }
    }

    async validate(): Promise<Array<Issue>> {


        const validations = await Promise.all([
            this.validateHref(),
            this.validateText()
        ])

        return validations.filter(issue => issue !== undefined)
    }

}

export default AnchorComponent
