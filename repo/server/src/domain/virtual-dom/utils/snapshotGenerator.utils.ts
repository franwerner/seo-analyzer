import BaseComponent, { Children } from "@/domain/virtual-dom/components/base.component"
import HTMLComponent from "@/domain/virtual-dom/components/html.component"
import TextComponent from "@/domain/virtual-dom/components/text.component"
import VDomContext from "@/domain/virtual-dom/context/vDom.context"
import ComponentFactory from "@/domain/virtual-dom/utils/componentFactory.util"
import VirtualDom from "@/domain/virtual-dom/virtualDom.entity"
import * as cheerio from "cheerio"
import { Element } from "domhandler"
import HTMLNotFountError from "../errors/HTMLNotFount.error"

export default class SnapshotGeneratorUtility {

    private static readonly ignoreTags = ["style", "svg", "noscript"]
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

    private static createJSDOM(htmlString: string) {
        const dom = cheerio.load(htmlString)

        const html = dom("html")[0]

        if (!html || html.name != "html") {
            throw new HTMLNotFountError()
        }

        return html
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

        for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i]

            if (!child) continue

            if (child.type == "text") {
                childrens.push(new TextComponent({
                    text: child.data,
                    parent
                }))
            }
            else if (child.type == "tag" && !this.ignoreTags.includes(child.name) || child.type == "script") {
                const nextPathDom = parentPathDom + "/" + child.name + "/" + i
                const Component = ComponentFactory.getComponent(child.name)
                const componentInstance = new Component({
                    tag: child.name,
                    attributes: child.attribs,
                    vDomContext: parent.vDomContext,
                    pathDom: nextPathDom,
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
        htmlString,
        document
    }: {
        htmlString: string,
        document: VirtualDom
    }) {

        const html = this.createJSDOM(htmlString)

        const vDomContext = new VDomContext()

        const HTMLComponent = ComponentFactory.getComponent("HTML")

        const htmlPathDom = "html"

        const htmlInstance = new HTMLComponent({
            tag: html.name,
            attributes: html.attribs,
            vDomContext,
            pathDom: htmlPathDom,
            parent: null,
            document
        }) as HTMLComponent


        htmlInstance.children = this.generateChildren({
            parent: htmlInstance,
            elem: html,
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
