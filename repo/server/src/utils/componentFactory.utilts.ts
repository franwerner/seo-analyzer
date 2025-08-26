import AnchorComponent from "../components/anchor.component";
import BaseComponent from "../components/base.component";
import HTMLComponent from "../components/html.component";
import ImgComponent from "../components/img.component";
import LinkComponent from "../components/link.component";
import MetaComponent from "../components/meta.component";
import type TextComponent from "../components/text.component";

const components = {
    HTML: HTMLComponent,
    A: AnchorComponent,
    LINK: LinkComponent,
    META: MetaComponent,
    IMG: ImgComponent
}


class ComponentFactory {

    static getComponent(tag: string) {
        if (tag in components) {
            return components[tag as keyof typeof components]
        }

        return BaseComponent
    }

    static createComponent(tag: string, children: Array<BaseComponent | TextComponent>, properties: HTMLBaseElement) {
        const Component = this.getComponent(tag)

        return new Component({
            tag,
            children,
            hash: Component.generateHash(properties.outerHTML),
            attributes: Component.extractAttributes(properties.attributes),
        })
    }
}

export default ComponentFactory