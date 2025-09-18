import AnchorComponent from "@/components/anchor.component"
import H1Component from "../components/h1.component"
import H2Component from "../components/h2.component"
import ScriptComponent from "../components/script.component"

type Schemas = {
    faq: ScriptComponent | null,
    localBusiness: ScriptComponent | null
}

/**
 * El `VDomContext` nos ayuda a contextualizar el VDOM una vez finalice todo su creación y recorrido.
 * Cada componente, al ejecutarse, puede actualizar el `VDomContext` con información relevante.
 * Esto nos garantiza que al final del recorrido podamos realizar validaciones globales que requieren
 * la visión completa del VDOM.
 *
 * Por ejemplo, sin el `VDomContext` no podríamos validar si no existe un H1, ya que si el componente 
 * nunca se crea no tendríamos forma de detectarlo. Con el `VDomContext`, si la propiedad `h1` está vacía,
 * sabremos que no se creó ningún H1.
 *
 * Importante:
 * - Validaciones locales: cada componente valida sus propias reglas inmediatas (alt de imágenes, textos vacíos, etc.).
 * - Validaciones globales: reglas que requieren conocer todo el DOM (existencia de H1, duplicados, schemas, links rotos).
 */
export default class VDomContext {
    h2: Array<H2Component> = []
    h1: Array<H1Component> = []
    schemas: Schemas = {
        faq: null,
        localBusiness: null
    }
    a: Array<AnchorComponent> = []
    constructor() { }

}
