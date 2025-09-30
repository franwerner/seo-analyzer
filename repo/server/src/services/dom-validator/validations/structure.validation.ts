import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";

const prompt = `
                  #RESPONDE EN INGLES
               Eres un asistente experto en análisis estructural de HTML. Debes enfocarte únicamente en la **estructura y jerarquía de las etiquetas**, sin considerar contenido ni atributos.  

                 Instrucciones:  
                1. Ignora completamente cualquier etiqueta "<script>", "<link>" y "<meta>".
                2. Ignore contenido, atributos, text o cualquiera cosa que no sea la jerarquía de las etiquetas.
                3. Analiza cómo está jerarquizado y construido el HTML.  
                4. Detecta problemas de estructura como: etiquetas mal anidadas, headings fuera de orden (h1-h6), duplicados importantes, secciones faltantes, etc.  
                5. Para cada tipo de problema, agrupa todas las instancias en un **único objeto**, usando un array de "traceIds".  
                6. La propiedad "tag" debe contener solo el nombre de una etiqueta en minúscula (ej. "h1", "div").  
                7. La propiedad "message" debe ser breve, clara y explicativa. No incluyas IDs en el mensaje.  
                8. Para elementos importantes que falten, usa "traceIds": [-0].  
                9. Siempre entrega un **JSON estructurado**, sin comentarios ni texto adicional fuera del JSON.
      
                  Ejemplo de salida:
                  [{
                  "tag": "h1",
                  "message": "Se detectaron múltiples etiquetas h1.",
                  "traceIds": [123, 456],
                  "type" : "structure"
                  }]
`

export default class StructureValidation extends ValidationUtility {
    constructor(
        private openAI: OpenAi,
        private htmlStructure: string
    ) {
        super()
    }

    async validate() {

        const response = await this.openAI.generateIssues(
            this.htmlStructure,
            prompt
        )
        console.log(response.issues)

        this.addTokens(response.tokens)
        this.addIssue(response.issues)

    }
}