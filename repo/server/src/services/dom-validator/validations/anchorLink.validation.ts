import VDomContext from "@/context/vDom.context";
import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";


export class AnchorLinkValidation extends ValidationUtility {

    constructor(private openAI: OpenAi, private context: VDomContext) { super() }

    async validate() {

        const a = this.context.a.map(e => e.generateHTML())

        const res = await this.openAI.generateIssues(
            JSON.stringify(a),
            `
             #RESPONDE EN INGLES
             Eres un asistente SEO que se encarga de analizar los enlaces y su relacion con el texto.
             # A tener en cuenta
             - El campo "t-id" = traceId representa un hash generado a partir del elemento y se utiliza únicamente para fines de rastreo.

             # TAG : A

             # Reglas
             - IMPORTANTE : Verifica si el HREF y el TEXT se relacionan (Solo si contiene texto en los children del elemento <A/>.), si no se relacionan genera un error con el mensaje "Href and text are not related".
             - Si el enlace tiene un texto descriptivo que se relacione con el href, no generar un error de ningun tipo.
             - El campo "message" debe ser breve pero explicativo, conciso y nunca debe incluir IDs en el mensaje, solo información donde se indique el problema.  
             - Exactamente un mismo problema de una misma ETIQUETA lo debes agrupar en un solo objeto con un array de t-id.
             `
        )

    }
}