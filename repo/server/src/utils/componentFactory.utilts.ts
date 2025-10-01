import LinkComponent from "@/components/link.component";
import AnchorComponent from "@/components/anchor.component";
import BaseComponent from "@/components/base.component";
import H1Component from "@/components/h1.component";
import H2Component from "@/components/h2.component";
import HTMLComponent from "@/components/html.component";
import ImgComponent from "@/components/img.component";
import ScriptComponent from "@/components/script.component";
import H3Component from "@/components/h3.component";
import MetaComponent from "@/components/meta.component";
import TitleComponent from "@/components/title.component";

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