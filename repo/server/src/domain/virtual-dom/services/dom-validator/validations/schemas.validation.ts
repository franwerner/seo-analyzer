import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import { Issue } from "@/infrastructure/schemas/issue.schema";
import OpenAi from "@/infrastructure/AI/openAi.service";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import ValidationType from "@/domain/virtual-dom/types/ValidationType.enum";
import ScriptComponent from "@/domain/virtual-dom/components/script.component";
import HTMLComponent from "@/domain/virtual-dom/components/html.component";

const prompt = `
#RESPONDE EN INGLES
Eres un experto en análisis de schemas de datos estructurados, y tu tarea es evaluar el schema en base a un resumen de una página web.

INSTRUCCIONES:

1. Evalúa si el schema es correcto según las mejores prácticas de SEO técnico y datos estructurados.
2. No es necesario señalar errores estrictos. En cambio, enfócate en mejorar la implementación del schema.
3. El análisis debe estar escrito en un solo bloque de texto, sin listas ni viñetas.
4. No menciones ni indiques nada relacionado a otros schemas ni sugiere alternativas a otros tipos de validación.
5. El feedback debe ser específico, bastante breve , relevante y alineado con las mejores prácticas de datos estructurados y SEO técnico.

#Ejemplo de salida:
[Schema: LocalBusiness]  
El schema está bien estructurado en su mayoría, pero se encontraron algunos detalles que pueden mejorarse para optimizar su implementación.

[Problema: address] La propiedad "address" no incluye todos los detalles necesarios, como el código postal. Asegúrese de que esté completa.  
[Problema: telephone] La propiedad "telephone" no está correctamente formateada. Debe incluir el número completo con el formato estándar.  
[Problema: sameAs] La propiedad "sameAs" no contiene URLs de redes sociales relevantes, lo que podría mejorar la autoridad de la página.
`


export default class SchemaValidaton extends ValidationUtility {
    constructor(
        private openAi: OpenAi,
        private context: VDomContext,
        private pageSummary: string,
        private root: HTMLComponent
    ) {
        super()
    }

    private static getIssueForSchema(name: string): Issue {
        return {
            message: `Not found ${name} schema`,
            tag: "script",
            traceIds: [],
            type: ValidationType.SCHEMA
        }
    }


    private validateLocalBusiness() {
        const { localBusiness } = this.context.schemas
        if (!localBusiness) {
            this.addIssue(SchemaValidaton.getIssueForSchema("LocalBusiness"))
            return
        }
        return this.validateWithAi(localBusiness)
    }

    private validateFaqPage() {
        const { faqPage } = this.context.schemas
        if (!faqPage) {
            this.addIssue(SchemaValidaton.getIssueForSchema("FAQPage"))
            return
        }

        return this.validateWithAi(faqPage)

    }

    private async validateWithAi(script: ScriptComponent) {

        const instruction = `
        ${prompt}

        Contexto de la página WEB: 
        Resumen de la web : ${this.pageSummary} 
        Lenguaje: ${this.root.attributes.lang || "Sin especificar"}
        `;

        const { response, tokens } = await this.openAi.createBasicResponse(
            script.innerText.value,
            instruction
        )

        this.addIssue({
            message: response,
            tag: "script",
            traceIds: [script.traceId],
            type: ValidationType.SCHEMA
        })
        this.addTokens(tokens)

    }

    async validate() {
        await Promise.all([
            this.validateFaqPage(),
            this.validateLocalBusiness()
        ])
    }
}
