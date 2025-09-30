import BaseComponent, { Children } from "@/components/base.component"
import TextComponent from "@/components/text.component"
import VDomContext from "@/context/vDom.context"
import { JSDOM, VirtualConsole } from "jsdom"
import ComponentFactory from "./componentFactory.utilts"
import ErrorHandler from "./errorHandler.utils"


export default class VirtualDomGeneratorUtility {

    private static readonly virtualConsole = new VirtualConsole()
    private static readonly ignoreTags = ["STYLE", "#comment", "svg", "NOSCRIPT"]


    private static createJSDOM(htmlString: string) {
        const dom = new JSDOM(htmlString, { virtualConsole: this.virtualConsole })

        const html = dom.window.document.children[0]

        if (!html || html.nodeName != "HTML") {
            throw new ErrorHandler({
                message: "HTML element not found",
                status_code: 404
            })
        }

        return html
    }

    private static createContext() {
        return new VDomContext()
    }


    private static generateChildren(parent: BaseComponent, elem: Element, pathDom: string, ctx: Array<Function>) {

        const childrens: Array<Children> = []

        for (let i = 0; i < elem.childNodes.length; i++) {
            const child = elem.childNodes[i] as Element

            if (child.nodeName == "#text") {
                const text = child.nodeValue || ""
                if (text.trim().length > 0) {
                    childrens.push(new TextComponent({
                        text,
                        parent
                    }))
                }
            }
            else if (!this.ignoreTags.includes(child.nodeName) && child.nodeName != "HTML") {
                const nextPathDom = pathDom + "/" + child.nodeName + "/" + i
                const Component = ComponentFactory.getComponent(child.nodeName)
                const componentInstance = new Component({
                    tag: child.nodeName,
                    attributes: child.attributes,
                    vDomContext: parent.vDomContext,
                    children: [],
                    pathDom: nextPathDom,
                    parent
                })
                ctx.push(componentInstance.afterCreateInstance.bind(componentInstance))
                componentInstance.children = this.generateChildren(componentInstance, child, nextPathDom, ctx)
                childrens.push(componentInstance)
            }
        }

        return childrens
    }

    static async generateRoot(htmlString: string) {

        const html = this.createJSDOM(htmlString)

        const vDomContext = this.createContext()

        const HTMLComponent = ComponentFactory.getComponent("HTML")

        const htmlPathDom = "HTML"

        const htmlInstance = new HTMLComponent({
            tag: "HTML",
            attributes: html.attributes,
            vDomContext,
            children: [],
            pathDom: htmlPathDom,
            parent: null
        })

        const ctx: Array<Function> = []

        htmlInstance.children = this.generateChildren(htmlInstance, html, htmlPathDom, ctx)

        ctx.forEach(fn => fn())
        return {
            root: htmlInstance,
            vDomContext
        }
    }

}