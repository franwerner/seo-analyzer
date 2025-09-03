const analyzeMock = {
    "issues": [
        {
            "message": "Meta description genérica y poco optimizada para ubicación/servicios; mejorar para CTR y keywords locales.",
            "tag": "meta",
            "traceIds": [
                "-1254042314"
            ]
        },
        {
            "message": "Imágenes sin atributo ALT o con ALT genérico/no descriptivo. Optimizar ALT con descripción útil y palabras clave locales cuando proceda.",
            "tag": "img",
            "traceIds": [
                "-165090827",
                "418715928",
                "2138458860",
                "660262574",
                "-917196926",
                "540478135",
                "-835097701",
                "696338076",
                "-1298842730",
                "1553685178",
                "-1241972849",
                "1542889123",
                "-1135692892",
                "1044519973",
                "-375350147",
                "1257642708",
                "1761973374",
                "-1265414661",
                "1759167799",
                "913417576",
                "1709965036",
                "-498256465",
                "-1025553948",
                "-263753613",
                "-1099118827",
                "-205155227",
                "843795365",
                "-1414976092",
                "1781002852",
                "1125967847",
                "-2104346585",
                "460348966",
                "355968889",
                "-220403424",
                "-504797263",
                "-805208788",
                "1987475096",
                "-1278130154",
                "363217826",
                "609114431",
                "-1099118827"
            ]
        },
        {
            "message": "Error ortográfico en encabezado ('Insullation' → 'Insulation').",
            "tag": "h3",
            "traceIds": [
                "-508781284"
            ]
        },
        {
            "message": "Ningun error solo es un ejemplo",
            "tag": "h3",
            "traceIds": [
                "-508781284"
            ]
        },
        {
            "message": "Error ortográfico en opción del formulario ('Insullation' → 'Insulation').",
            "tag": "option",
            "traceIds": [
                "1274061055"
            ]
        },
        {
            "message": "Error ortográfico en etiqueta del formulario ('Seervices' → 'Services').",
            "tag": "label",
            "traceIds": [
                "1225445961"
            ]
        },
        {
            "message": "Error ortográfico en CTA ('Eestimate' → 'Estimate').",
            "tag": "span",
            "traceIds": [
                "-760263606"
            ]
        },
        {
            "message": "Elementos <video> sin transcripción/description ni marcado VideoObject; añadir poster, captions y schema para indexación y accesibilidad del contenido multimedia.",
            "tag": "video",
            "traceIds": [
                "-640308678",
                "-1459123757"
            ]
        },
        {
            "message": "Texto concatenado sin espacio después de una etiqueta (<strong>) provocando 'difference,your'. Corregir espaciado.",
            "tag": "p",
            "traceIds": [
                "-921200948"
            ]
        }
    ],
    "feedback": [
        "Tema principal e intención de búsqueda: Página orientada a servicios de ático (insulación, limpieza, sellado de conductos, barrera de vapor, ventiladores de ático, control de roedores) para la zona de la Bahía de San Francisco (Bay Area). Intención: comerciales/informacional con objetivo de captación de clientes locales (lead generation).",
        "Recomendación de contenido y palabras clave: Aumentar contenido único por página para atacar variaciones locales (ej. 'attic insulation Fremont', 'attic cleanup Bay Area', nombres de ciudades servidas). Añadir más texto que describa procesos, beneficios y FAQs con lenguaje natural y long‑tails. Incluye variantes, problemas que resuelven y llamadas a la acción orientadas a la localización.",
        "Schema y datos estructurados: Falta marcado LocalBusiness/Service, Review (aggregateRating), VideoObject para los videos y ImageObject para imágenes clave. Implementar JSON‑LD con: name, address (coincidente con NAP), geo, telephone, serviceOffered, aggregateRating y FAQ/Q&A donde aplique. Esto mejora visibilidad en resultados locales y rich snippets.",
        "Señales locales y NAP: Hay dirección y teléfono en el footer, pero existe inconsistencia de marca (\"Attic Express\" vs \"Attics Express\" vs \"Attic's Express\"). Unificar nombre comercial en todo el sitio y en fichas externas (Google Business Profile, directorios). Mostrar la ciudad/áreas servidas en el contenido principal (no solo footer).",
        "Optimización de imágenes: Además de ALT descriptivo, usar nombres de archivo y captions descriptivos (ej. attic-cleanup-fremont.webp). Comprimir y servir WebP/AVIF en hero y galerías, y proporcionar srcset adecuado para responsive. Añadir atributo loading=lazy a imágenes no críticas (varias ya lo usan).",
        "Videos: Añadir transcripciones y descripciones textuales cerca del video; declarar durations y thumbnails; implementar VideoObject JSON‑LD (title, description, thumbnailUrl, uploadDate, duration, contentUrl).",
        "Anchors y CTAs: Muchos CTAs usan texto genérico ('Contact Us', 'Get Started'). Para SEO local y CTR, optimizar anchor text y CTAs con intención y ubicación (ej. 'Free attic inspection Fremont'). Evitar texto sensacionalista en enlaces (ej. el enlace con título 'Do NOT follow this link...' es sospechoso y resta confianza).",
        "Opiniones y estructura de reviews: Las reseñas aparecen como texto, pero no hay schema para aprovechar aggregateRating. Marcar reseñas con Review/aggregateRating y, si procede, usar snippets de FAQ/HowTo para procesos comunes.",
        "Ortografía y calidad del contenido: Corregir todas las faltas ortográficas detectadas (ej. 'Insullation', 'Seervices', 'Eestimate', problemas de espacios). Errores deterioran la percepción de autoridad y CTR en resultados. Revisar todo el sitio por inconsistencias de escritura.",
        "Meta y Open Graph: La meta description es genérica; incluir servicio principal + ubicación + propuesta de valor + CTA en ~120–155 caracteres. Mantener coherencia entre title, meta description, og:title y twitter:title pero evitar duplicar exactamente el mismo texto en todo el sitio; adaptar para redes sociales.",
        "Enlaces internos y arquitectura: Asegurar que cada servicio tiene su propia landing optimizada (con contenido único, H1/H2 que contengan la keyword, y schema Service). Aumentar enlaces internos desde la home hacia esas páginas con anchor text descriptivo.",
        "Reviews estructuradas y confianza: Implementar schema de Review con puntuación media y número de reseñas reales (si procede) para potenciar rich snippets. Verificar que los enlaces a reseñas externas apunten a fuentes verificables (Google/Yelp) y usar rel=\"noopener\" y target=\"_blank\" (ya presentes en algunos) uniformemente.",
        "Evitar contenido duplicado y textos repetidos: Aunque el HTML muestra elementos repetidos por diseño, vigilar bloques que duplican títulos o descripciones en la página (pueden diluir señales SEO). No eliminar elementos repetidos necesarios para layout pero evitar replicar frases clave sin valor añadido.",
        "Prioridad de corrección (orden sugerido): 1) Corregir faltas ortográficas visibles y coherencia de marca; 2) Optimizar ALT de imágenes críticas y CTA text; 3) Añadir LocalBusiness/Service + Review JSON‑LD; 4) Transcripciones y VideoObject; 5) Revisar meta description y CTA para SEO local; 6) Mejorar profundidad de contenido por servicio y páginas ciudad específicas.",
        "Notas técnicas adicionales (no evaluar enlaces/link tags): Evitar exponer versiones de plugins en meta-generator en entornos públicos si preocupa la seguridad, y revisar que los assets críticos tengan alt y tamaños adecuados para carga rápida."
    ],
    "tokens": {
        "input": 17022,
        "output": 9268
    }
}

export default analyzeMock