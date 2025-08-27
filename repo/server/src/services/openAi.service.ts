import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import util from "util"
import issuesSchema from "../schemas/issues.schema";

const asistantContent = `
RESPÓNDOME EN ESPAÑOL.
Eres un asistente experto en SEO técnico y SEO de contenido, especializado en optimizar sitios web para lograr un posicionamiento efectivo en buscadores.
Analiza tanto la semántica como el contenido del HTML. Determina claramente de qué trata la página (tema principal e intención de búsqueda)
y utiliza esa información para brindar el mejor feedback posible orientado a un correcto posicionamiento SEO.
Incluye absolutamente todos los problemas detectados de SEO. **NO OMITAS NINGUNO.**


#IMPORTANTE
- Respeta exactamente el schema indicado.
- El campo "t-id" representa un hash generado a partir del outerHTML del elemento y se utiliza únicamente para fines de rastreo.
- Pueden existir valores de "t-id" repetidos si el contenido de los elementos es idéntico. Esto es válido *NO LO VEAS COMO UN ERROR*.

Reglas de salida:
1. Detecta problemas técnicos de SEO (etiquetas faltantes, duplicadas o mal implementadas).
2. Detecta problemas de contenido (keywords ausentes, repetidas, stuffing, titles, headings, meta description).
3. Detecta errores tipográficos en el contenido.
4. Exactamente un mismo problema de una misma ETIQUETA lo debes agrupar en un solo objecto con un array de t-id.
5. No evalúes si los links funcionan.
6. No evalúes aspectos relacionados con accesibilidad, diseño visual o usabilidad del sitio. Solo enfócate en SEO técnico para indexación y contenido.
7. El campo "message" debe ser breve , conciso y **nunca debe incluir IDs en el mensaje**, solo informacion donde se indique el problema.
8. Todos los problemas que no correspondan a una ETIQUETA del HTML existente, deben agruparse en la propiedad "feedback". Aquí debes ser lo más expresivo y detallado posible (PERO NO REPITAS ERRORES DE LAS ISSUES)
9. En la propiedad "tag" incluye solo el nombre de UNA etiqueta (ej: "title", "meta", "h1"). No uses combinaciones ni texto adicional.

`;

class OpenAiService {
    openAI: OpenAI
    constructor() {
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        })
    }

    async generateIssues(html: string) {
        console.time("generateIssues")
        const response = await this.openAI.responses.create({
            model: "gpt-5-mini",
            text: {
                format: zodTextFormat(
                    z.object({
                        issues: issuesSchema,
                        feedback: z.array(z.string())
                    }),
                    "issues")
            },
            instructions: asistantContent,
            input: html,
        },
        )
        console.timeEnd("generateIssues")
        console.log(response)
        console.log(util.inspect(JSON.parse(response.output_text), false, null))
    }

}

export default OpenAiService