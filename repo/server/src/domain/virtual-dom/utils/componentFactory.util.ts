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
    html: HTMLComponent,
    a: AnchorComponent,
    script: ScriptComponent,
    h2: H2Component,
    img: ImgComponent,
    h1: H1Component,
    h3: H3Component,
    meta: MetaComponent,
    title: TitleComponent
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