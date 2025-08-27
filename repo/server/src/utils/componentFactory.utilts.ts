import AnchorComponent from "../components/anchor.component";
import BaseComponent from "../components/base.component";
import HTMLComponent from "../components/html.component";
import LinkComponent from "../components/link.component";
import type TextComponent from "../components/text.component";

const components = {
    HTML: HTMLComponent,
    A: AnchorComponent,
    LINK: LinkComponent,
}

class ComponentFactory {

    static getComponent(tag: string) {
        if (tag in components) {
            return components[tag as keyof typeof components]
        }

        return BaseComponent
    }

    static createComponent(properties: HTMLBaseElement, children: Array<BaseComponent | TextComponent>,) {
        const Component = this.getComponent(properties.nodeName)

        return new Component({
            nodeName: properties.nodeName,
            outerHTML: properties.outerHTML,
            attributes: properties.attributes,
            children,
        })
    }
}

export default ComponentFactory