import { randomUUID, createHash } from "crypto";
import TextComponent from "./text.component";

interface BaseComponentProps {
    tag: string;
    hash: string;
    children?: Array<BaseComponent | TextComponent>
    attributes: Record<string, string>
}

export type Issues = Array<{ message: string, type: string, hash: string }>

class BaseComponent {
    uuid: string
    tag: BaseComponentProps['tag'];
    children: Required<BaseComponentProps>['children']
    hash: BaseComponentProps['hash']
    attributes: Required<BaseComponentProps>['attributes']
    issues: Issues

    static pickableAttributes: Array<string> | "*" = []

    /**HACER PICK MAS COMPLEJOS, COMO PICKEAR TODOS PERO EXCLUIR LOS ID's, CLASES, DATA-SET */

    constructor({ tag, children, hash, attributes }: BaseComponentProps) {
        this.tag = tag
        this.children = children || []
        this.attributes = attributes || {}
        this.uuid = randomUUID()
        this.hash = hash
        this.issues = []
    }

    static generateHash(value: Element["outerHTML"]) {
        /**
         * Este hash nos ayuda a rastrear posteriormente el Element en el DOM.
         */
        return createHash('sha256').update(value).digest('hex')
    }

    static extractAttributes(inputAttributes: NamedNodeMap) {
        const result: Record<string, string> = {}
        Array.from(inputAttributes).forEach(attr => {
            if (this.pickableAttributes === "*" || this.pickableAttributes.includes(attr.name)) {
                result[attr.name] = attr.value
            }
        })
        return result
    }

    generateJson(): {
        uuid: string,
        tag: string,
        attributes: Record<string, string>,
        children: Array<ReturnType<BaseComponent['generateJson']> | string>,
    } {
        return {
            uuid: this.uuid,
            tag: this.tag,
            attributes: this.attributes,
            children: this.children.map((child) => child instanceof TextComponent ? child.text : child.generateJson())
        }
    }

    async validate(): Promise<Issues> {
        let issues: Issues = []
        const childrenIssues = await Promise.all(this.children.map(child => child instanceof TextComponent ? [] : child.validate()))
        issues.push(...childrenIssues.flat())
        return issues
    }

}

export type { BaseComponentProps }
export default BaseComponent