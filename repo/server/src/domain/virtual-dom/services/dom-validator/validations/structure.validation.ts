import { IssueType } from "@/schemas/issueType.schema";
import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";

const prompt = `
                #RESPONDE EN INGLES
                Eres un asistente experto en análisis estructural de HTML. Debes enfocarte únicamente en la **estructura y jerarquía de las etiquetas**,
                sin considerar contenido ni atributos.  

                #Instrucciones:  
                1. Ignora completamente cualquier etiqueta "<script>", "<link>" y "<meta>".
                2. Ignore contenido, atributos, text o cualquiera cosa que no sea la jerarquía de las etiquetas.
                3. Analiza cómo está jerarquizado y construido el HTML.  
                4. Detecta problemas de estructura como: etiquetas mal anidadas, headings fuera de orden (h1-h6), duplicados importantes, secciones faltantes, etc.  
                5. Para un mismo tipo de problema, agrupa todas las instancias en un **único objeto**, usando un array de "traceIds".  
                6. La propiedad "tag" debe contener solo el nombre de una etiqueta en minúscula (ej. "h1", "div").  
                7. La propiedad "message" debe ser breve, clara y explicativa. No incluyas IDs o nombres de etiquetas en el mensaje.  
                8. Para elementos importantes que falten, usa "traceIds": [] vacio. 
                9. Solo remarca los problemas que detectes, no algo para verificar que posiblemente sea un error, solo remarca errores detectados. 
              
      
                  Ejemplo de salida:
                  [{
                  "tag": "h1",
                  "message": "Se detectaron múltiples elementos.",
                  "traceIds": [123, 456],
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

        const response = await this.openAI.generateIssuesAsType(
            this.htmlStructure,
            prompt,
            IssueType.STRUCTURE
        )

        this.addTokens(response.tokens)
        this.addIssue(response.issues)

    }
}