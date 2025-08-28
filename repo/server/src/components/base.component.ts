import TextComponent from "./text.component";
import type { Issues } from "../schemas/issues.schema";
import crc32 from "crc-32"

interface BaseComponentProps {
    nodeName: string;
    children?: Array<BaseComponent | TextComponent>
    attributes: NamedNodeMap
    traceId: string
}

type Children = Array<BaseComponent | TextComponent>
type Attributes = Record<string, string>

/*
 * Solo se indican los atributos que **no se deben pickear**, porque la IA 
 * tiende a generar falsos positivos si falta algún atributo que considera relevante.
 * La estrategia consume un poco más de tokens, pero asegura mayor efectividad
 * a la hora de analizar SEO y evita errores falsos.
 */

const notPickableAttributesExp = /^(class|id|style|data-.*|aria-.*)$/

const selfClosingTags = [
    "AREA", "BASE", "BR", "COL", "EMBED", "HR", "IMG",
    "INPUT", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"
]


class BaseComponent {

    nodeName: string;
    children: Children
    traceId: string
    attributes: Attributes
    needsClosingTag: boolean

    constructor({ nodeName, children, attributes, traceId }: BaseComponentProps) {
        this.nodeName = nodeName
        this.children = children || []
        this.attributes = (this.constructor as typeof BaseComponent).extractAttributes(attributes) /** el this.constructor hace referencia a la clase/subclase, */
        this.traceId = traceId
        this.needsClosingTag = BaseComponent.needsClosingTag(nodeName)
    }

    static generateHash(forHash: string) {
        /**
         * Este hash nos ayuda a rastrear posteriormente el elemento en el DOM.
         */
        return crc32.str(forHash).toString()
    }


    private static needsClosingTag(nodeName: string) {
        /**Verifica si necesita un cierre  */
        return !selfClosingTags.includes(nodeName)
    }
    static extractAttributes(inputAttributes: NamedNodeMap) {
        return Array.from(inputAttributes).reduce((acc, attr) => {
            const currentName = attr.name
            if (
                !notPickableAttributesExp.test(currentName)
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