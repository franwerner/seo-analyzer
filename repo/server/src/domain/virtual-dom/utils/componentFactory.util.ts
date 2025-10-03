import LinkComponent from "@/domain/virtual-dom/components/link.component";
import AnchorComponent from "@/domain/virtual-dom/components/anchor.component";
import BaseComponent from "@/domain/virtual-dom/components/base.component";
import H1Component from "@/domain/virtual-dom/components/h1.component";
import H2Component from "@/domain/virtual-dom/components/h2.component";
import HTMLComponent from "@/domain/virtual-dom/components/html.component";
import ImgComponent from "@/domain/virtual-dom/components/img.component";
import ScriptComponent from "@/domain/virtual-dom/components/script.component";
import H3Component from "@/domain/virtual-dom/components/h3.component";
import MetaComponent from "@/domain/virtual-dom/components/meta.component";
import TitleComponent from "@/domain/virtual-dom/components/title.component";

const components = {
    HTML: HTMLComponent,
    A: AnchorComponent,
    SCRIPT: ScriptComponent,
    H2: H2Component,
    IMG: ImgComponent,
    H1: H1Component,
    H3: H3Component,
    LINK: LinkComponent,
    META: MetaComponent,
    TITLE: TitleComponent
} as const

class ComponentFactory {

    static getComponent(tag: string) {
        if (tag in components) {
            return components[tag as keyof typeof components]
        }

        return BaseComponent
    }


}

export default ComponentFactory