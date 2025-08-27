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

    static pickPropertiesForHash(properties: HTMLElement | null) {
        if (!properties) return ""
        return Array.from(properties.attributes).map(attr => `${attr.name}=${attr.value}`).join(" ") + properties.nodeName
    }

    static createComponent(properties: HTMLElement, children: Array<BaseComponent | TextComponent>,) {
        const Component = this.getComponent(properties.nodeName)

        return new Component({
            nodeName: properties.nodeName,
            traceId: Component.generateHash(this.pickPropertiesForHash(properties) + this.pickPropertiesForHash(properties.parentElement)),
            attributes: properties.attributes,
            children,
        })
    }
}

export default ComponentFactory