import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import ValidationType from "@/domain/virtual-dom/types/ValidationType.enum";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";
import OpenAi from "@/infrastructure/AI/openAi.service";

export default class SemanticValidation extends ValidationUtility {
    constructor(
        private openAI: OpenAi,
        private htmlSemantic: Array<string>,
        private pageSummary: string,
        private context: VDomContext
    ) {
        super()
    }


    private async validateHrefSemanticChunk(chunk: Array<string>) {
        const res = await this.openAI.generateIssueTraceIds(
            JSON.stringify(chunk),
            `
                #RESPONDE EN INGLES
                 Eres un asistente SEO experto en análisis semántico de enlaces (anchor links).  
                 Tu tarea es revisar un conjunto de elementos <a> y analizar si existe coherencia semántica entre el texto visible del enlace y el destino indicado en el atributo href.
                 Realiza el analisis minuciosamente  y exahustivamente, no dejes pasar nada.
                 
                 ## Instrucciones:
                 1. Analiza únicamente los elementos <a> que contengan texto visible en sus hijos.
                 2. Revisa la coherencia semántica entre el texto visible del enlace y el destino indicado en el atributo href.
                 3. Si el href es un enlace interno (es decir, si comienza con #), asegúrate de que el texto visible sea **coherente y semánticamente relacionado** con el nombre de la sección interna (por ejemplo, #contact, #about).  
                 - Si el texto no está relacionado con la sección a la que hace referencia el href, **genera un problema**.
                 4. Utiliza el atributo t-id de cada etiqueta <a> para generar el array de traceIds de los elementos que no cumplen con la coherencia semántica **SOLO COLOCA EL t-id y NADA MAS*.
                 5. Si el texto del enlace es **descriptivo, coherente o semánticamente relacionado** con el destino indicado en el atributo href, **no generes ningún problema**.
                 6. No evalúes ortografía, gramática ni estructura técnica, solo la relación semántica entre el texto del enlace y el valor del atributo href.

                 ## Ejemplo de salida:
                 {
                 "traceIds": [12343415, -1231412] **SOLO COLOCA LOS t-id y NADA MAS**
                 }
                  
                  `
        )
        return res
    }

    async validateHrefSemantic() {
        const a = this.context.a.map(e =>
            e.generateInnerHTML({ includeAttributes: true, includeChildrenAtts: false })
        )


        const chunks = []
        const chunkSize = 25
        const chunksCount = Math.ceil(a.length / chunkSize)
        for (let i = 0; i < chunksCount; i++) {
            const nextIndex = i * chunkSize
            chunks.push(a.slice(nextIndex, nextIndex + chunkSize))
        }

        chunks.forEach(chunk => console.log(chunk, chunk.length))

        const res = await Promise.all(chunks.map(chunk => this.validateHrefSemanticChunk(chunk)))

        const {
            tokens,
            traceIds
        } = res.reduce((acc, { traceIds, tokens }) => {
            acc.traceIds.push(...traceIds)
            acc.tokens.input += tokens.input
            acc.tokens.output += tokens.output
            return acc
        }, {
            traceIds: [] as Array<string>,
            tokens: {
                input: 0,
                output: 0
            }
        })

        if (traceIds.length > 0) {
            this.addIssue({
                type: ValidationType.SEMANTIC,
                message: "href and text are not semantically related",
                tag: "a",
                traceIds
            })
        }
        this.addTokens(tokens)

    }

    async validateHtmlSemantic() {
        const { issues, tokens } = await this.openAI.generateIssuesAsType(
            JSON.stringify(this.htmlSemantic),
            `
        #RESPONDE EN INGLES:

        Eres un analista SEO experto en semántica web.
        Tu tarea es analizar la coherencia semántica de una página web en base a:
        1. Un resumen que describe la intención y el contexto de la página.
        2. Un conjunto de etiquetas HTML (title, meta description, h1, h2, h3 etc.) extraídas del sitio.

        ### Objetivo
        Detecta y lista todos los problemas semánticos encontrados. 
        Evalúa si el contenido de las etiquetas refleja correctamente el propósito del resumen proporcionado.

       ## Instrucciones específicas
       1. Analiza **cada etiqueta de forma individual e independiente**.  
       - No generes errores que involucren o comparen varias etiquetas a la vez.
       - Si detectas un problema entre dos etiquetas (por ejemplo, title y h1 no coinciden), **crea dos errores separados**, uno para cada etiqueta implicada.
       2. Utiliza el atributo t-id de cada etiqueta como traceIds.
       3. Compara el resumen con el contenido de la etiqueta analizada, no tienes que ser tan estricto con el cumplimiento de ciertas palabrasya que el resumen puede no ser tan descriptivo.
       4. Identifica incongruencias de tema o intención (por ejemplo: el título habla de "Roof Repair" pero el encabezado trata "Gutters").
       5. Detecta repeticiones innecesarias o sobreoptimización de palabras clave.
       6. No analices sintaxis, estructura HTML ni errores ortográficos. Solo el **significado del contenido**.
       7. Para un mismo tipo de problema, agrupa todas las instancias en un **único objeto**, usando un array de "traceIds".
       7. La propiedad "tag" debe contener **solo una etiqueta** en minúscula (por ejemplo: "h1", "meta").
       8. La propiedad "message" debe ser breve, clara y explicativa. No incluyas IDs, nombres de etiquetas ni relaciones entre elementos en el mensaje.

        ### Entrada:
        - Resumen del contenido: ${this.pageSummary}

        ### Ejemplo de salida:
        [{
        "tag": "h1",
        "message": "El título no refleja correctamente el tema principal de la página.",
        "traceIds": [123],
        }]
            
            `,
            ValidationType.SEMANTIC
        )

        this.addTokens(tokens)
        this.addIssue(issues)
    }

    async validate() {

        await Promise.all([
            this.validateHtmlSemantic(),
            this.validateHrefSemantic()
        ])

    }

}