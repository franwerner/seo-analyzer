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
    "tokens": {
        "input": 944,
        "output": 4967
    }
}
export default seoDetailsMock