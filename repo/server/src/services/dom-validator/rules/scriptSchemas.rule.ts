import { DomContext } from "@/helper/domContext.helper";
import { Issue } from "@/schemas/issues.schema";
import OpenAi from "@/services/openAi.service";
import { OpenAiOutput } from "@/schemas/openAiOutput.schema";
export default async function ScriptSchemasRule({
    context,
    openAi,
    html
}: {
    context: DomContext,
    openAi: OpenAi,
    html: string
}): Promise<OpenAiOutput> {

    const { localBusinessSchema, faqSchema } = context.schemas

    let issues: Issue[] = []
    let tokens = {
        input: 0,
        output: 0
    }

    if (!localBusinessSchema) {
        issues.push({
            message: "Not found LocalBusiness schema ",
            tag: "script",
            traceIds: ["-0"]
        })
    }
    if (!faqSchema) {
        issues.push({
            message: "Not found FAQ schema",
            tag: "script",
            traceIds: ["-0"]
        })
    }

    if (localBusinessSchema || faqSchema) {
        const prompt = `
        Schemas a analizar:
        
        TAG : script

        1. LocalBusiness Schema:
        ${localBusinessSchema?.generateHTML() || "No existe"}
        
        2. FAQ Schema:
        ${faqSchema?.generateHTML() || "No existe"}
        
        INSTRUCCIONES:
        1. Analiza únicamente cada schema individualmente. No analices ninguna otra parte del HTML.
        2. Evalúa si el schema es correcto y cumple con SEO técnico y buenas prácticas de structured data.
        3. Indica problemas detectados de manera breve y clara para cada schema.
        4. Proporciona sugerencias concretas de mejora si es necesario.
        5. Si no encuentras problemas en un schema, devuelve un array vacío para ese schema.
        6. No hagas comentarios de ninguna otra parte del HTML o página.
        `;

        const { issues: issuesOpenAi, tokens: tokensOpenAi } = await openAi.generateIssues(html, prompt)
        issues.push(...issuesOpenAi)
        tokens = tokensOpenAi
    }

    return {
        issues,
        tokens: tokens
    }
}

