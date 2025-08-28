import type { SeoDetails } from "@/types/seoDetailsInterface.type";

const seoDetailsMock: SeoDetails = {
    "issues": [
        {
            "message": "Title genérico y no alineado con el H1 principal; mejora para intención de búsqueda.",
            "tag": "title",
            "traceIds": [
                "1884604844"
            ]
        },
        {
            "message": "Uso de meta 'keywords' (obsoleta) y contenido con términos spammy.",
            "tag": "meta",
            "traceIds": [
                "-1522209434"
            ]
        },
        {
            "message": "Presencia de múltiples etiquetas H1 (duplicadas); debe haber un único H1 representativo.",
            "tag": "h1",
            "traceIds": [
                "49381774",
                "49381774"
            ]
        },
        {
            "message": "H2 poco descriptivo y no optimizado para intención de búsqueda.",
            "tag": "h2",
            "traceIds": [
                "1163000670"
            ]
        },
        {
            "message": "Imágenes sin atributo alt; añadir textos alternativos descriptivos.",
            "tag": "img",
            "traceIds": [
                "1698889552",
                "-1078792667"
            ]
        },
        {
            "message": "Contenido con keyword stuffing / texto spam dentro del div.",
            "tag": "div",
            "traceIds": [
                "161880827"
            ]
        },
        {
            "message": "Uso de etiqueta obsoleta <marquee>; evita elementos no semánticos y obsoletos.",
            "tag": "marquee",
            "traceIds": [
                "-1340497698"
            ]
        },
        {
            "message": "Uso de <b> no semántico; usa <strong> para énfasis relevante.",
            "tag": "b",
            "traceIds": [
                "677954862"
            ]
        },
        {
            "message": "Uso de <i> no semántico; usa <em> para énfasis semántico.",
            "tag": "i",
            "traceIds": [
                "1605956671"
            ]
        },
        {
            "message": "Uso de <u> no semántico; evita subrayados que confunden enlaces y usuarios.",
            "tag": "u",
            "traceIds": [
                "-89616708"
            ]
        },
        {
            "message": "Tabla usada para maquetación en lugar de estructura semántica del contenido.",
            "tag": "table",
            "traceIds": [
                "-605780285"
            ]
        },
        {
            "message": "Iframe sin atributo title y con contenido que probablemente no sea indexable.",
            "tag": "iframe",
            "traceIds": [
                "1814444546"
            ]
        }
    ],
    "feedback": [
        "Faltan etiquetas/meta importantes para SEO técnico: no hay meta description, no hay etiqueta canonical y no se detecta meta robots — añade descripción única, canonical adecuada y control de indexación según corresponda.",
        "No se detecta meta viewport en el head; añade meta viewport para asegurar rendering móvil y mejorar métricas de SEO móvil.",
        "Evita el uso de meta keywords (ya presente) y elimina cualquier texto oculto o técnicas de stuffing; Google penaliza keyword stuffing y contenido oculto.",
        "Revisa contenido incrustado (iframe) y elementos obsoletos: considera reemplazar iframes por contenido indexable o proveer alternativas indexables.",
        "Mejorar el title y los headings: sincroniza title, H1 y H2 con la intención de búsqueda objetivo; usa palabras clave relevantes de forma natural.",
        "Añade Open Graph y Twitter Card metadata para mejorar visibilidad en redes sociales y CTR desde compartidos.",
        "Implementa datos estructurados (schema.org) donde aplique (producto, artículo, breadcrumb, etc.) para mejorar CTR y resultados enriquecidos.",
        "Asegura que las imágenes tengan atributos width/height para mejorar CLS y considera srcset/formats modernos para performance.",
        "Evita elementos de presentación no semánticos (b/i/u, marquee) y usa etiquetas semánticas HTML5 (header, main, nav, article, section, footer) para clarificar la estructura para buscadores.",
        "Recomendación general: elimina contenido de prueba/spam y publica contenido único, relevante y alineado a intención de búsqueda; revisa que todo el contenido indexable aporte valor.",
        "No se detectaron errores ortográficos evidentes en el texto visible.",
        "Recomiendo auditar el sitio con una herramienta de crawl (Screaming Frog, Sitebulb) y con Search Console para identificar 404/recursos bloqueados y problemas de rastreo que no pueden detectarse solo con el HTML estático."
    ],
    "tokens": {
        "input": 944,
        "output": 4967
    }
}
export default seoDetailsMock