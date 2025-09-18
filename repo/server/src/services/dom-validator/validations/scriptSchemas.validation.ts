import VDomContext from "@/context/vDom.context";
import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";

export default class ScriptSchemasValidation extends ValidationUtility {
    constructor(
        private openAi: OpenAi,
        private html: string,
        private context: VDomContext
    ) {
        super()
    }

    private static getIssueForSchema(name: string) {
        return {
            message: `Not found ${name} schema`,
            tag: "script",
            traceIds: ["-0"]
        }
    }

    private validateSchemaIfNotExists() {
        const { localBusiness, faq } = this.context.schemas
        if (!localBusiness) {
            this.addIssue(ScriptSchemasValidation.getIssueForSchema("LocalBusiness"))
        }
        if (!faq) {
            this.addIssue(ScriptSchemasValidation.getIssueForSchema("FAQ"))
        }
    }

    private async validateWithAi() {

        const { localBusiness, faq } = this.context.schemas

        if (!localBusiness || !faq) return

        const prompt = `
        #RESPONDE EN INGLES
        
        Schemas a analizar:
        
        TAG : script

        1. LocalBusiness Schema:
        ${localBusiness?.generateHTML() || "No existe"}
        
        2. FAQ Schema:
        ${faq?.generateHTML() || "No existe"}
        
        INSTRUCCIONES:
        1. Analiza únicamente cada schema individualmente. No analices ninguna otra parte del HTML.
        2. Evalúa si el schema es correcto y cumple con SEO técnico y buenas prácticas de structured data.
        3. Indica problemas detectados de manera breve y clara para cada schema.
        4. Proporciona sugerencias concretas de mejora si es necesario.
        5. El campo "message" debe ser breve pero explicativo, conciso y nunca debe incluir IDs en el mensaje, solo información donde se indique el problema.  
        6. Si no encuentras problemas en un schema, devuelve un array vacío para ese schema.
        7. No hagas comentarios de ninguna otra parte del HTML o página.
        `;

        const { issues: issuesOpenAi, tokens: tokensOpenAi } = await this.openAi.generateIssues(this.html, prompt)

        this.addIssue(issuesOpenAi)
        this.addTokens(tokensOpenAi)
    }


    async validate() {
        this.validateSchemaIfNotExists()
        await this.validateWithAi()
    }
}
