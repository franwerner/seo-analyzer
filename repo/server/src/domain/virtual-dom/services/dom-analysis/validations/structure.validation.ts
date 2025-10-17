import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import { ValidationTypeEnum } from "@packages/common";

const prompt = `
                #RESPONDE EN INGLES
                Eres un asistente experto en análisis estructural de HTML. Debes enfocarte únicamente en la **estructura y jerarquía de las etiquetas**,
                sin considerar contenido ni atributos.  

                #Instrucciones:  
                1. Ignora completamente cualquier etiqueta "<script>", "<link>" y "<meta>".
                2. Utiliza el atributo t-id de cada etiqueta como traceIds.
                3. Ignore contenido, atributos, text o cualquiera cosa que no sea la jerarquía de las etiquetas.
                4. Analiza cómo está jerarquizado y construido el HTML.  
                5. Detecta problemas de estructura como: etiquetas mal anidadas, headings fuera de orden (h1-h6), duplicados importantes, secciones faltantes, etc.  
                6. Para un mismo tipo de problema, agrupa todas las instancias en un **único objeto**, usando un array de "traceIds".  
                7. La propiedad "tag" debe contener solo el nombre de una etiqueta en minúscula (ej. "h1", "div").  
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
        private context: VDomContext,
        private htmlStructure: string
    ) {
        super()
    }


    private validateH1() {
        const h1 = this.context.headings.h1

        if (h1.length > 1) {
            this.addIssue({
                message: "The webpage contains more than one h1 element",
                tag: "H1",
                traceIds: h1.map(prev => prev.traceId),
                type: ValidationTypeEnum.STRUCTURE
            })
        } else if (h1.length === 0) {
            this.addIssue({
                message: "No h1 found",
                tag: "H1",
                traceIds: [],
                type: ValidationTypeEnum.STRUCTURE
            })
        }
    }

    private validateH2() {
        const h2 = this.context.headings.h2
        if (h2.length > 10) {
            this.addIssue({
                message: "The webpage contains more than 10 h2 elements",
                tag: "h2",
                traceIds: h2.map(prev => prev.traceId),
                type: ValidationTypeEnum.STRUCTURE
            })
        }
    }

    private validateTitle() {
        const title = this.context.title
        if (title.length === 0) {
            this.addIssue({
                message: "No title found",
                tag: "title",
                traceIds: [],
                type: ValidationTypeEnum.STRUCTURE
            })
        } else if (title.length > 1) {
            this.addIssue({
                message: "The webpage contains more than one title element",
                tag: "title",
                traceIds: title.map(prev => prev.traceId),
                type: ValidationTypeEnum.STRUCTURE
            })
        }
    }

    private validateMeta() {
        const meta = this.context.metaDescription
        if (meta.length === 0) {
            this.addIssue({
                message: "No meta description found",
                tag: "meta",
                traceIds: [],
                type: ValidationTypeEnum.STRUCTURE
            })
        } else if (meta.length > 1) {
            this.addIssue({
                message: "The webpage contains more than one meta description element",
                tag: "meta",
                traceIds: meta.map(prev => prev.traceId),
                type: ValidationTypeEnum.STRUCTURE
            })
        }
    }


    private async validateWithAI() {
        const response = await this.openAI.generateIssuesAsType(
            this.htmlStructure,
            prompt,
            ValidationTypeEnum.STRUCTURE
        )

        this.addTokens(response.tokens)
        this.addIssue(response.issues)

    }

    async validate() {

        this.validateH1()
        this.validateH2()
        this.validateTitle()
        this.validateMeta()

        await this.validateWithAI()
    }
}