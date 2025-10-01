import { Issue } from "@/schemas/issue.schema";
import type { Attributes, BaseComponentProps } from "./base.component";
import BaseValidatableComponent from "./baseValidatable.component";

const notValidText = ["read more", "learn more", "see more"]

class AnchorComponent extends BaseValidatableComponent {

    private localContext: {
        isValidHttpUrl: boolean
        isGenericText: boolean
        hasBlackHoleHref: boolean
    } = {
            isValidHttpUrl: false,
            isGenericText: false,
            hasBlackHoleHref: false
        }

    static readonly pattern = /^(https?:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/;

    constructor(props: BaseComponentProps) {
        super(props)
    }

    private static isValidHttpUrl(url: any) {
        return AnchorComponent.pattern.test(url);
    }

    private static isGenericText(text: string) {
        const containsKeyword = notValidText.some(keyword => text.toLowerCase() == keyword)
        return containsKeyword
    }

    private static hasBlackHoleHref(attributes: Attributes) {
        const isBlackHoleHref = attributes.href?.includes("blackhole")
        return !!isBlackHoleHref
    }


    contextualizeVDom() {
        super.contextualizeVDom()
        const { isGenericText, hasBlackHoleHref } = this.localContext
        if (!this.attributes.href || isGenericText || hasBlackHoleHref) return
        this.vDomContext.a.push(this)
    }

    private async validateHref() {
        const href = this.attributes.href
        const { isValidHttpUrl, hasBlackHoleHref } = this.localContext
        if (!isValidHttpUrl || hasBlackHoleHref || !href) return
        try {
            const res = await fetch(href, { method: "HEAD" })
            if ([404, 500, 504].includes(res.status)) throw ""
        } catch (error) {
            return {
                message: `${href} link broken`,
                traceIds: [this.traceId],
                tag: this.tag,
                type: "resource"
            } satisfies Issue
        }
    }

    private async validateText() {

        const { isGenericText } = this.localContext
        if (isGenericText) {
            return {
                message: `the text "${this.innerText}" is not very descriptive`,
                traceIds: [this.traceId],
                tag: this.tag,
                type: "semantic"
            } satisfies Issue
        }
    }

    async validate() {

        if (!this.attributes.href) return {
            message: "Anchor without href",
            traceIds: [this.traceId],
            tag: this.tag,
            type: "semantic"
        } satisfies Issue

        const validations = await Promise.all([
            this.validateHref(),
            this.validateText()
        ])

        return validations.filter(issue => issue !== undefined)
    }

    private setLocalContext() {
        /**
         * Nos ayuda a cachear algunas verificaciones internas que se repitan en varios metodos internos del componente.
         */
        this.localContext.isValidHttpUrl = AnchorComponent.isValidHttpUrl(this.attributes.href)
        this.localContext.isGenericText = AnchorComponent.isGenericText(this.innerText.value)
        this.localContext.hasBlackHoleHref = AnchorComponent.hasBlackHoleHref(this.attributes)
    }

    init(): void {
        super.init()
        this.setLocalContext()
    }

}

export default AnchorComponent
