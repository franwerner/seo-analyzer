import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/utils/validation.util";

const generalPrompt = `
#RESPONDE EN INGLES
Eres un asistente experto en SEO técnico y SEO de contenido, especializado en optimizar sitios web para lograr un posicionamiento efectivo en buscadores. 
Analiza tanto la semántica como el contenido del HTML. 
Determina claramente de qué trata la página (tema principal e intención de búsqueda) y utiliza esa información para brindar el mejor feedback posible orientado a un correcto posicionamiento SEO. 
SOLO PROBLEMAS QUE AFECTAN AL SEO DIRECTAMENTE.

# A tener en cuenta
- Respeta exactamente la estructura del SCHEMA indicado.
- El campo "t-id" representa un hash generado a partir del elemento y se utiliza únicamente para fines de rastreo.
- Pueden existir valores de "t-id" repetidos si el contenido de los elementos es idéntico. Esto es válido, NO LO CONSIDERES UN ERROR.
- TODA LA INFORMACIÓN DEBE SER ENTENDIBLE PARA UNA PERSONA QUE CONOCE SEO BÁSICO.
- Cuando se especifica en una regla de salida (Solo si existen) significa que si no existen no debes evaluarlo.

#IMPORTANTE
1. NO debes analizar Etiquetas A, SCRIPT e IMG , ya que el analisis lo hace otro servicio.
2. No debes analizar ESQUEMAS de los SCRIPTS

# NO EVALUAR
1. Textos repetidos por diseño (ejemplo: menús, botones, footer).  
2. Accesibilidad, diseño visual o usabilidad.  

# Reglas de salida
1. Detecta problemas técnicos de SEO (etiquetas faltantes, duplicadas —que no sean de un carrusel— o mal implementadas).  
2. Analiza la jerarquía de los headings y si su contenido es coherente con el contenido de la página (Solo si existen).  
3. Revisa errores de ortografía, solo palabras mal escritas que sean muy evidentes, no hagas correciones por mayusculas o cualquier otra cosa que no tenga que ver con palabras mal escritas..  
4. Exactamente un mismo problema de una misma ETIQUETA lo debes agrupar en un solo objeto con un array de t-id.  
5. En la propiedad "tag" incluye solo el nombre de UNA etiqueta (ej: "title", "meta", "h1"). No uses combinaciones ni texto adicional.  
6. El campo "message" debe ser breve pero explicativo, conciso y nunca debe incluir IDs en el mensaje, solo información donde se indique el problema.  
7. Detecta problemas de contenido: titles, meta description, keywords. Revisa si hay keywords ausentes, repetición excesiva (stuffing) o falta de relación con el tema principal.  
8. Faltantes de alguna etiqueta IMPORTANTE para el SEO, utiliza el SCHEMA de salida y traceIds = [-0].
`;


export default class HtmlAiValidation extends ValidationUtility {
    constructor(
        private openAi: OpenAi,
        private html: string
    ) {
        super()
    }


    async validate() {
        const issues = await this.openAi.generateIssues(this.html, generalPrompt)

    }
}
