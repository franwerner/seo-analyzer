import AnchorComponent from "../services/components/anchor.component";
import BaseComponent from "../services/components/base.component";
import HTMLComponent from "../services/components/html.component";
import ImgComponent from "../services/components/img.component";
import LinkComponent from "../services/components/link.component";
import MetaComponent from "../services/components/meta.component";
import type TextComponent from "../services/components/text.component";

const components = {
    HTML: HTMLComponent,
    A: AnchorComponent,
    LINK: LinkComponent,
    META: MetaComponent,
    IMG: ImgComponent
}


class HtmlComponentFactory {

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

export default HtmlComponentFactory