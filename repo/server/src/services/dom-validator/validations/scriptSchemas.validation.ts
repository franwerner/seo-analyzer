import VDomContext from "@/context/vDom.context";
import { Issue } from "@/schemas/issue.schema";
import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";

export default class ScriptSchemasValidation extends ValidationUtility {
    constructor(
        private openAi: OpenAi,
        private context: VDomContext
    ) {
        super()
    }

    private static getIssueForSchema(name: string): Issue {
        return {
            message: `Not found ${name} schema`,
            tag: "script",
            traceIds: [],
            type: "schema"
        }
    }

    private validateSchemaIfNotExists() {
        const { localBusiness, faqPage } = this.context.schemas
        if (!localBusiness) {
            this.addIssue(ScriptSchemasValidation.getIssueForSchema("LocalBusiness"))
        }
        if (!faqPage) {
            this.addIssue(ScriptSchemasValidation.getIssueForSchema("FAQPage"))
        }
    }

    private async validateWithAi() {

        const { localBusiness, faqPage } = this.context.schemas

        if (!localBusiness && !faqPage) return

        const prompt = `
        #RESPONDE EN INGLES
        
        Schemas a analizar:
        - Pueden ser uno o mas schemas.
        
        TAG : script

        
        INSTRUCCIONES:
        1. Analiza únicamente cada schema individualmente.
        2. Evalúa si el schema es correcto y cumple con SEO técnico y buenas prácticas de structured data.
        3. Indica problemas detectados de manera breve y clara para cada schema.
        4. Proporciona sugerencias concretas de mejora si es necesario.
        5. El campo "message" debe ser breve pero explicativo , solo información donde se indique el problema.  
        6. Si no encuentras problemas en un schema, devuelve un array vacío para ese schema.
        7. No hagas comentarios de ninguna otra parte del HTML o página.
        8. Todo de un mismo schema solo en un messaje de respuesta no generes varios mensajes del mismo tipo
        `;


    }


    async validate() {
        this.validateSchemaIfNotExists()
        await this.validateWithAi()
    }
}
