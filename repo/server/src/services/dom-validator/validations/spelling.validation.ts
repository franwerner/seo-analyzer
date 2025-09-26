import VDomContext from "@/context/vDom.context";
import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";

export default class SpellingValidation extends ValidationUtility {
    constructor(
        private context: VDomContext,
        private openAI: OpenAi
    ) {
        super()
    }

    async validate() {
        const { issues, tokens } = await this.openAI.generateIssues(`
            Eres un asistente que analiza la ortografia del texto de los elementos HTML.
            Por cada texto debes devolver un error solo con las palabras con mala ortografia.
            
            #Reglas:
            1.Si encuentras palabras que parecen abreviadas o incompletas, primero analiza el contexto de la página 
             y del contenido circundante para determinar si realmente se trata de una abreviatura válida relacionada con la página, o si es un error ortográfico.
            2. En la propiedad "tag" incluye solo el nombre de UNA etiqueta (ej: "title", "meta", "h1"). No uses combinaciones ni texto adicional.  
            3. En la propiedad "traceId" incluye el id del elemento HTML que contiene el texto.  
            `,
            JSON.stringify(this.context.texts)
        )
        this.addIssue(issues)
        this.addTokens(tokens)
    }

}