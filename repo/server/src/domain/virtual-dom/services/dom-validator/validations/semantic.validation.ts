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


    async validateHrefSemantic() {
        const a = this.context.a.map(e =>
            e.generateInnerHTML({ includeAttributes: true, includeChildrenAtts: false })
        )

        const { issues, tokens } = await this.openAI.generateIssuesAsType(
            JSON.stringify(a),
            `
                  #RESPONDE EN INGLES

                  Eres un asistente SEO experto en análisis semántico de enlaces (anchor links).
                  Tu tarea es revisar un conjunto de elementos <a> y analizar si existe coherencia semántica entre el texto visible del enlace y el destino indicado en el atributo href.

                  ## Objetivo
                  Detectar enlaces cuyo texto (anchor text) **no refleje o no se relacione** con el contenido al que apuntan.

                  ## Instrucciones
                  1. Analiza únicamente los elementos <a> que contengan texto visible en sus hijos.
                  2. Compara el texto del enlace con su href.
                  3. Si el texto es **descriptivo, coherente o semánticamente relacionado** con el href, **no generes ningún problema**.
                  4. La propiedad "tag" debe ser siempre "a" en minúscula.
                  5. La propiedad "message" debe ser breve, clara y explicativa. No incluyas IDs, rutas completas o texto HTML dentro del mensaje.
                  6. Agrupa el mismo tipo de error en un único objeto, usando un array de "traceIds".
                  7. No evalúes ortografía, gramática ni estructura técnica. Solo la relación semántica entre texto y destino.

                  ## Ejemplo de salida
                  [
                    {
                      "tag": "a",
                      "message": "Href and text are not related.",
                      "traceIds": [12, 34, 56]
                    }
                  ]
                  `,
            ValidationType.SEMANTIC
        )

        this.addIssue(issues)
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
       2. Compara el resumen con el contenido de la etiqueta analizada, no tienes que ser tan estricto con el cumplimiento de ciertas palabrasya que el resumen puede no ser tan descriptivo.
       3. Identifica incongruencias de tema o intención (por ejemplo: el título habla de "Roof Repair" pero el encabezado trata "Gutters").
       4. Detecta repeticiones innecesarias o sobreoptimización de palabras clave.
       5. No analices sintaxis, estructura HTML ni errores ortográficos. Solo el **significado del contenido**.
       6. Para un mismo tipo de problema, agrupa todas las instancias en un **único objeto**, usando un array de "traceIds".
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