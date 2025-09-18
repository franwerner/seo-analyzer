import TextComponent from "./text.component";
import type { Issues } from "../schemas/issues.schema";
import crc32 from "crc-32";
import { DomContext } from "../helper/domContext.helper";
import OpenAi from "@/services/openAi.service";


interface BaseComponentProps {
    tag: string;
    children?: Array<BaseComponent | TextComponent>
    attributes: NamedNodeMap
    pathDom: string,
    domContext: DomContext
    openAi: OpenAi
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
    "area", "base", "br", "col", "embed", "hr", "img",
    "input", "link", "meta", "param", "source", "track", "wbr"
]



class BaseComponent {

    tag: string;
    children: Children
    traceId: string
    attributes: Attributes
    needsClosingTag: boolean
    domContext: DomContext
    isIgnored?: boolean
    openAi: OpenAi


    constructor({ tag, children, attributes, pathDom, domContext, openAi }: BaseComponentProps) {
        this.tag = tag.toLowerCase()
        this.children = children || []
        this.attributes = (this.constructor as typeof BaseComponent).extractAttributes(attributes) /** el this.constructor hace referencia a la clase/subclase, */
        this.traceId = BaseComponent.generateHash(pathDom)
        this.needsClosingTag = BaseComponent.needsClosingTag(tag)
        this.openAi = openAi
        this.domContext = domContext
        this.isIgnored = this.shouldIgnore()
    }

    protected shouldIgnore(): boolean | undefined {
        /***
         * No es un metodo estatico, ya que se necesita que para evaluar si debe ignorarse o no, 
         * se hace en base a los valores de la instancia y como estan compuestos
        */
        return false
    }

    private static generateHash(forHash: string) {
        /**
         * Este hash nos ayuda a rastrear posteriormente el elemento en el DOM.
         */
        return crc32.str(forHash).toString()
    }


    private static needsClosingTag(tag: string) {
        /**Verifica si necesita un cierre  */
        return !selfClosingTags.includes(tag)
    }

    private static extractAttributes(inputAttributes: NamedNodeMap) {
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

        const tag = this.tag

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