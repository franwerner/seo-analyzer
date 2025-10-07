import { Issue } from "@/infrastructure/schemas/issue.schema";
import type { BaseComponentProps } from "./base.component";
import BaseValidatableComponent, { ValidateReturn } from "./baseValidatable.component";
import BaseComponent from "./base.component";
import URLUtility from "@/shared/utils/URL.util";
import ValidationType from "../types/ValidationType.enum";

const notValidText = ["read more", "learn more", "see more"]

class AnchorComponent extends BaseValidatableComponent {

    private localContext: {
        isGenericText: boolean
        containImage: boolean
        isValidURL: boolean
    } = {
            isGenericText: false,
            containImage: false,
            isValidURL: false
        }

    constructor(props: BaseComponentProps) {
        super(props)
    }

    contextualizeVDom() {
        super.contextualizeVDom()
        const { isGenericText, containImage, isValidURL } = this.localContext
        const notContextualize = isGenericText || containImage || !isValidURL
        if (notContextualize) return
        this.vDomContext.a.push(this)
    }

    private static isGenericText(text: string) {
        const normalizedText = text.replace(/\s+/g, ' ').trim().toLowerCase()
        const containsKeyword = notValidText.some(keyword => normalizedText == keyword)
        return containsKeyword
    }

    private static isValidURL(href: any) {
        //Blackhole generalmente son detectores de bots, no se deben considerar un URL valida para evitar bloqueos.
        return URLUtility.isValidURL(href) && !href.includes("blackhole")
    }


    private validateText() {
        const { isGenericText } = this.localContext
        if (isGenericText) {
            return {
                message: `the text "${this.innerText.value}" is not very descriptive`,
                traceIds: [this.traceId],
                tag: this.tag,
                type: ValidationType.SEMANTIC
            } satisfies Issue
        }
    }

    private validateHref() {
        const href = this.attributes.href

        if (!href) return {
            message: `the anchor does not have a href`,
            traceIds: [this.traceId],
            tag: this.tag,
            type: ValidationType.SEMANTIC
        } satisfies Issue
    }

    validateSemantic() {
        return [
            this.validateHref(),
            this.validateText()
        ].filter(issue => issue !== undefined)
    }

    async validateResource() {
        const href = this.attributes.href
        const { isValidURL } = this.localContext
        if (!isValidURL || !href) return

        try {
            const res = await fetch(href, { method: "HEAD" })
            if ([404, 500, 504].includes(res.status)) throw ""
        } catch (error) {
            console.log(error)
            return {
                message: `${href} link broken`,
                traceIds: [this.traceId],
                tag: this.tag,
                type: ValidationType.RESOURCE
            } satisfies Issue
        }
    }


    private setLocalContext() {
        /**
         * Nos ayuda a cachear algunas verificaciones internas que se repitan en varios metodos internos del componente.
         */
        const href = this.attributes.href
        this.localContext.isGenericText = AnchorComponent.isGenericText(this.innerText.value)
        this.localContext.isValidURL = AnchorComponent.isValidURL(href)
        this.localContext.containImage = this.getOrThrowChildren().some(child => child instanceof BaseComponent && child.tag == "img")
    }

    completeHrefWithBase() {
        const componentHref = this.attributes.href
        if (componentHref === undefined) return // Se evalua si es undefined, si es un string vacio sigue siendo un url valida.

        const documentURL = this.document.url.href // Siempre termina con "/"
        try {
            const outputURL = new URL(componentHref, documentURL)
            /**
             * Ejemplo: Resuelve hrefs relativas y absolutas.
             *
             * @example
             * const documentURL = "https://example.com/blog/"
             *
             * new URL("/about", documentURL).href; // => "https://example.com/about"
             * new URL("about", documentURL).href;  // => "https://example.com/blog/about"
             */
            this.attributes.href = outputURL.href
        } catch (error) {
        }

    }

    init(): void {
        super.init()
        this.completeHrefWithBase()
        this.setLocalContext()
    }

}

export default AnchorComponent
