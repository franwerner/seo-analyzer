import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import crc32 from "crc-32";
import VirtualDom from "../virtualDom.entity";
import TextComponent from "./text.component";

interface BaseComponentProps {
    tag: string;
    children?: Childrens
    attributes: NamedNodeMap
    pathDom: string,
    vDomContext: VDomContext
    parent: Parent
    document: VirtualDom
}

export type Children = BaseComponent | TextComponent
export type Parent = BaseComponent | null
type Childrens = Array<Children>
export type Attributes = Record<string, string>

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

const inlineTextSeparatorTags = [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "span",
    "a",
    "small",
    "sub",
    "sup",
    "mark",
    "code",
    "cite",
    "del",
    "ins",
    "q",
    "abbr",
    "br"
]

class BaseComponent {

    tag: string;
    children?: Childrens
    traceId: string
    attributes: Attributes
    needsClosingTag: boolean
    vDomContext: VDomContext
    parent: Parent
    document: VirtualDom
    innerText: {
        value: string,
        claimedByParent: boolean
    } = {
            value: "",
            claimedByParent: false
        }
    private isInlineTextSeparator: boolean = false

    constructor({ tag, children, attributes, pathDom, vDomContext, parent, document }: BaseComponentProps) {
        const tagToLowerCase = tag.toLowerCase()
        this.tag = tagToLowerCase
        this.parent = parent
        this.children = children
        this.isInlineTextSeparator = inlineTextSeparatorTags.includes(tagToLowerCase)
        this.attributes = BaseComponent.extractAttributes(attributes)
        this.traceId = BaseComponent.generateTraceIdHash(pathDom)
        this.needsClosingTag = !selfClosingTags.includes(tagToLowerCase)
        this.vDomContext = vDomContext
        this.document = document
    }

    getParentIfNotNull() {
        if (!this.parent) {
            throw new Error("Parent is null")
        }
        return this.parent
    }

    getOrThrowChildren() {
        if (!this.children) {
            throw new Error("Children is null")
        }
        return this.children
    }

    contextualizeVDom() {
        /**
        * @note
        * 
        * La contextualización se apoya en la estructura completa del VDOM, y debe ejecutarse en orden jerárquico
        * de arriba hacia abajo para garantizar consistencia.
        * Esto se debe a que algunas contextualizacion necesitan acceder al estado de sus hijos para tomar deciciones de contextualizacion.
        * 
        */
        if (this.innerText.claimedByParent || !this.innerText.value.trim() || this.tag === "script") return
        this.vDomContext.innerTextChunks.pushComponentText(this)
    }

    private static generateTraceIdHash(forHash: string) {
        /**
         * Este hash nos ayuda a rastrear posteriormente el elemento en el DOM.
         */
        return crc32.str(forHash).toString()
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

    generateInnerHTML(props: {
        includeAttributes?: boolean
        includeChildrenAtts?: boolean
    } = {}): string {

        const { includeAttributes, includeChildrenAtts } = props

        const attrs = includeAttributes ? Object.entries(this.attributes)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${value}`)
            .join(" ") : ""

        const tag = this.tag

        const childrenStr = this.getOrThrowChildren()
            .map(child => child instanceof TextComponent ? child.text : child.generateInnerHTML({ includeAttributes: includeChildrenAtts }))
            .join("")

        return this.needsClosingTag ?
            `<${tag} t-id=${this.traceId} ${attrs}>${childrenStr}</${tag}>` : `<${tag} t-id=${this.traceId} ${attrs} />`
    }

    private generateInnerText() {
        const children = this.getOrThrowChildren()
        return children.reduce((acc, child, index) => {
            if (child instanceof TextComponent) {
                acc += child.text
            }
            else if (child.tag == "br") {
                /**
                 * Como no se detectan los saltos de linea con \n se debe verificar, 
                 * si el siguiente hermano tiene un espacio al inicio, entonces no sera necesario agregar el espacio.
                 */
                child.innerText.claimedByParent = true
                const nextSibling = children[index + 1]
                const innerText = nextSibling instanceof TextComponent ? nextSibling.text : nextSibling?.innerText.value
                if (!innerText) return acc
                const includeSpace = innerText.startsWith(" ") ? "" : " "
                acc += includeSpace
            }
            else if (child.isInlineTextSeparator) {
                child.innerText.claimedByParent = true
                /**
                 * @note
                 * Cuando se obtiene el innerText de un hijo, ese hijo ya previamente deberia haber
                 * obtenido su innerText a travez de sus hijos y asi recursivamente.
                 */
                const treeTextOuput = child.innerText.value

                acc += treeTextOuput
            }
            return acc
        }, "")
    }
    private setInnerText() {

        this.innerText.value = this.generateInnerText()
    }


    init() {
        /**
         * Inicializa el componente.
         * @note Los children deben estar creados antes de ejecutar este método.
         */
        this.setInnerText()
    }

    toJSON() {

        const children = this.getOrThrowChildren().map(child => child instanceof TextComponent ? child.text : child.toJSON()) as Childrens

        return {
            tag: this.tag,
            attributes: this.attributes,
            traceId: this.traceId,
            needsClosingTag: this.needsClosingTag,
            innerText: this.innerText,
            children: children,
        }
    }

}

export type { BaseComponentProps };
export default BaseComponent