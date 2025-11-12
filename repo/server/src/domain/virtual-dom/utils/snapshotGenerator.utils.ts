import BaseComponent, { Children } from "@/domain/virtual-dom/components/base.component"
import HTMLComponent from "@/domain/virtual-dom/components/html.component"
import TextComponent from "@/domain/virtual-dom/components/text.component"
import VDomContext from "@/domain/virtual-dom/context/vDom.context"
import ComponentFactory from "@/domain/virtual-dom/utils/componentFactory.util"
import VirtualDom from "@/domain/virtual-dom/virtualDom.entity"
import { Element } from "domhandler"

export default class SnapshotGeneratorUtility {

    /** 
     * Se necesitan ignorar estas tags por:
     *  - Se pueden llegar a inyectar dinámicamente en el DOM, por alguna extension o algun otro motivo.
     *     Entonces se debera ignorar para evitar estos problemas, no lo soluciona al 100%, 
     *     pero es una solucion que por el momento se puede dejar utilizable la herramienta
     *  - Otro motivo es por que simplemente no son relevantes para el analaisis SEO y ahorra tokens.
     * 
    */
    private static readonly ignoreTags = ["style", "svg", "noscript", "#comment", "link", "iframe"]
    private static readonly ignoreTagsForHtmlStructure = ["script", "link", "meta"]


    private static generateHtmlStructure(root: HTMLComponent) {

        const tree = (c: BaseComponent): string => {

            const { tag, traceId } = c

            const children = c.getOrThrowChildren()

            if (!c.needsClosingTag) return `<${tag} t-id=${traceId}/>`

            const onlyChildrenBaseComponent = children.filter(child => child instanceof BaseComponent && !this.ignoreTagsForHtmlStructure.includes(child.tag)) as Array<BaseComponent>

            return `<${tag} t-id=${traceId}>${onlyChildrenBaseComponent.map(child => tree(child)).join("")}</${tag}>`
        }

        return tree(root)
    }

    private static genenerateHtmlSemantic(context: VDomContext): Array<string> {

        const metaFirst = context.metaDescription.at(0)
        const titleFirst = context.title.at(0)
        const h1First = context.headings.h1.at(0)

        const meta = metaFirst ? `<meta t-id=${metaFirst.traceId} name="description" content="${metaFirst.attributes.content}"/>` : ""
        const title = titleFirst ? `<title t-id=${titleFirst.traceId}>${titleFirst.innerText.value}</title>` : ""
        const h1 = h1First ? `<h1 t-id=${h1First.traceId}>${h1First.innerText.value}</h1>` : ""
        const h2s = context.headings.h2.map(i => `<h2 t-id=${i.traceId}>${i.innerText.value}</h2>`)
        const h3s = context.headings.h3.map(i => `<h3 t-id=${i.traceId}>${i.innerText.value}</h3>`)

        return [meta, title, h1, ...h2s, ...h3s].filter(i => i != "")
    }


    private static generateChildren({
        parent,
        elem,
        parentPathDom,
        document
    }: {
        parent: BaseComponent,
        elem: Element,
        parentPathDom: string,
        document: VirtualDom
    }) {

        const childrens: Array<Children> = []


        const children = elem.childNodes.filter(child => (child.nodeType == 1 && !this.ignoreTags.includes(child.name)) || child.nodeType == 3)

        for (let i = 0; i < children.length; i++) {
            const child = children[i]

            if (!child) continue

            if (child.type == "text") {
                childrens.push(new TextComponent({
                    text: child.data,
                    parent
                }))
            }
            else if (child.type == "tag" || child.type == "script") {
                const nextPathDom = parentPathDom + "/" + child.name + "/" + i
                const Component = ComponentFactory.getComponent(child.name)
                const componentInstance = new Component({
                    tag: child.name,
                    attributes: child.attribs,
                    vDomContext: parent.vDomContext,
                    traceId: BaseComponent.generateTraceIdHash(nextPathDom),
                    parent,
                    document
                })
                componentInstance.children = this.generateChildren({
                    parent: componentInstance,
                    elem: child,
                    parentPathDom: nextPathDom,
                    document
                })
                componentInstance.init()
                childrens.push(componentInstance)
            }
        }

        return childrens
    }

    private static contextualizeTree(base: BaseComponent) {

        base.contextualizeVDom()

        base.getOrThrowChildren().forEach(child => {
            if (child instanceof BaseComponent) {
                this.contextualizeTree(child)
            }
        })

    }

    static async generate({
        htmlElement,
        document
    }: {
        htmlElement: Element,
        document: VirtualDom
    }) {


        const vDomContext = new VDomContext()

        const HTMLComponent = ComponentFactory.getComponent("HTML")

        const htmlPathDom = "html"

        const htmlInstance = new HTMLComponent({
            tag: htmlElement.name,
            attributes: htmlElement.attribs,
            vDomContext,
            traceId: BaseComponent.generateTraceIdHash(htmlPathDom),
            parent: null,
            document
        }) as HTMLComponent


        htmlInstance.children = this.generateChildren({
            parent: htmlInstance,
            elem: htmlElement,
            parentPathDom: htmlPathDom,
            document
        })
        htmlInstance.init()


        this.contextualizeTree(htmlInstance)

        const htmlStructure = this.generateHtmlStructure(htmlInstance)
        const htmlSemantic = this.genenerateHtmlSemantic(vDomContext)

        return {
            root: htmlInstance,
            vDomContext,
            htmlStructure,
            htmlSemantic
        }
    }

}
