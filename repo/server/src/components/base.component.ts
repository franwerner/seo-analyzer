import { createHash } from "crypto";
import TextComponent from "./text.component";
import type { Issues } from "../schemas/issues.schema";

interface BaseComponentProps {
    nodeName: string;
    children?: Array<BaseComponent | TextComponent>
    attributes: NamedNodeMap
    outerHTML: string
}

type Children = Array<BaseComponent | TextComponent>
type Attributes = Record<string, string>

const seoAttributes = [
    "title",
    "name",
    "content",
    "charset",
    "http-equiv",
    "property",
    "rel",
    "href",
    "alt",
    "src",
    "lang",
    "hreflang",
    "itemprop"
]

const selfClosingTags = [
    "AREA", "BASE", "BR", "COL", "EMBED", "HR", "IMG",
    "INPUT", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"
]


class BaseComponent {

    nodeName: string;
    children: Children
    traceId: string
    attributes: Attributes
    issues: Issues
    needsClosingTag: boolean
    startPosition: number

    static pickableAttributes: Array<string> = []
    constructor({ nodeName, children, attributes, outerHTML }: BaseComponentProps) {
        this.nodeName = nodeName
        this.children = children || []
        this.attributes = (this.constructor as typeof BaseComponent).extractAttributes(attributes) /** el this.constructor hace referencia a la clase/subclase, */
        this.traceId = BaseComponent.generateHash(outerHTML)
        this.issues = []
        this.startPosition = 0
        this.needsClosingTag = BaseComponent.needsClosingTag(nodeName)
    }

    private static generateHash(outerHTML: Element["outerHTML"]) {
        /**
         * Este id nos ayuda a rastrear posteriormente el Element en el DOM.
         */
        return createHash('md5').update(outerHTML).digest('hex')
    }


    private static needsClosingTag(nodeName: string) {
        /**Verifica si necesita un cierre  */
        return !selfClosingTags.includes(nodeName)
    }
    static extractAttributes(inputAttributes: NamedNodeMap) {
        return Array.from(inputAttributes).reduce((acc, attr) => {
            const currentName = attr.name
            if (
                this.pickableAttributes.includes(currentName) ||
                seoAttributes.includes(currentName)
            ) {
                acc[currentName] = attr.value
            }
            return acc;
        }, {} as Attributes)
    }

    generateHTML(): string {
        const attrs = Object.entries(this.attributes)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join(" ")

        const tag = this.nodeName.toLowerCase()

        const childrenStr = this.children
            .map(child => child instanceof TextComponent ? child.text : child.generateHTML())
            .join("")

        /**
         * Deberia obtener la posicion del inicio del HTML para que la IA tenga una guia de que elemento html es el erroneo y poder darme un feedback correcto.
         */

        return this.needsClosingTag ?
            `<${tag} t-id=${this.traceId} ${attrs}>${childrenStr}</${tag}>` : `<${tag} t-id=${this.traceId} ${attrs} />`
    }

    async validate(): Promise<Issues> {
        /**
         * cada subclase implementa sus propias validaciones.
         */
        return []
    }

}

export type { BaseComponentProps };
export default BaseComponent