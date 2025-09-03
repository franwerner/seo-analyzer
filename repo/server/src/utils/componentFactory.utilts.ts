import AnchorComponent from "../components/anchor.component";
import BaseComponent from "../components/base.component";
import HTMLComponent from "../components/html.component";
import type TextComponent from "../components/text.component";

const components = {
    HTML: HTMLComponent,
    A: AnchorComponent,
}

class ComponentFactory {

    static getComponent(tag: string) {
        if (tag in components) {
            return components[tag as keyof typeof components]
        }

        return BaseComponent
    }

    static createComponent(
        properties: HTMLElement,
        children: Array<BaseComponent | TextComponent>,
        pathDom: string
    ) {
        const Component = this.getComponent(properties.nodeName)

        return new Component({
            tag: properties.nodeName.toLowerCase(),
            traceId: Component.generateHash(pathDom),
            attributes: properties.attributes,
            children,
        })
    }
}

export default ComponentFactory