import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./http/middlewares/errorGlobal.middleware";
import corsConfig from "./infrastructure/config/cors.config";
import AppRoutes from "./http/routes";
import { virtualWebStore } from "./infrastructure/bootstrap";


const v = virtualWebStore.createIfNotExists({
    host: "atticsexpress.com",
    pathname: "/",
    webSummary: {
        summary: 'Attic Express es una empresa de servicios de ático con sede en el Área de la Bahía de California que ofrece soluciones integrales para mejorar la eficiencia energética, la calidad del aire y la protección estructural del hogar; con más de 8 años de experiencia y un enfoque en materiales ecológicos y servicios personalizados, realizan limpieza y organización de áticos, instalación y reemplazo de aislamiento (incluyendo cellulose blown‑in), limpieza y sellado de conductos de aire, instalación y sustitución de conductos HVAC, prueba y sellado para fugas de aire, instalación de barreras de vapor y barreras radiantes, aislamiento de paredes, instalación de ventiladores de ático y escaleras de acceso, así como control y prueba contra roedores y limpieza de espacios de rastreo. Su propuesta de valor se centra en reducir costos de energía, mejorar la comodidad interior y prevenir humedad, moho y plagas mediante soluciones duraderas y certificadas, apoyadas por testimonios de clientes satisfechos y una galería de proyectos que muestra trabajos de limpieza, sellado, saneamiento y renovación de aislamiento; ofrecen estimados gratuitos y atención al cliente enfocada en resolver necesidades específicas de cada vivienda, presumen más de 89 hogares atendidos y reportan ahorro energético acumulado, y garantizan materiales y mano de obra de alta calidad con compromiso de servicio. Atienden al Área de la Bahía desde oficinas en 44837 Fremont Blvd, Fremont, CA 94538 y 27495 Manon Ave Apt. 17, Hayward, CA 94544; para consultas y cotizaciones pueden contactarlos al (408) 561‑1909 o por correo electrónico a atticsexpress@gmail.com.',
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})


const v2 = virtualWebStore.createIfNotExists({
    host: "withinhypnosis.com",
    pathname: "/",
    webSummary: {
        summary: "Within Hypnosis (Within Hypnotherapy), dirigida por Lucía, es una consulta de hipnoterapia clínica y coaching cognitivo-conductual certificada que ofrece servicios presenciales y online desde Alexandria, Virginia, y atiende a clientes en Virginia, Maryland y DC, así como a pacientes internacionales; su dirección es 58 Kennedy Street, Alexandria, VA 22305, teléfono (571) 207-7419 y correo info@withinhypnosis.com, y se comunica en inglés y español. La práctica se especializa en tratamientos basados en evidencia para la cesación de fumar, pérdida de peso, manejo del estrés y ansiedad, fobias y miedos, cambio de hábitos, insomnio y problemas de sueño, rendimiento deportivo, confianza y autoestima, además de trabajar relaciones, crianza, sanación del niño interior y técnicas de auto-hipnosis; integra hipnosis clínica con herramientas de terapia cognitivo-conductual para reprogramar el guion subconsciente, aprovechar asociaciones de aprendizaje, lidiar con respuestas primitivas de supervivencia y usar estados de concentración profunda (hipnosis) para facilitar cambios duraderos. Dentro del sitio se destacan la explicación clara de cómo funciona la hipnosis y el subconsciente (asociaciones, filtro crítico, sobrecarga y sugestibilidad), una sección de preguntas frecuentes que aclara seguridad, control durante la hipnosis, efectividad y número de sesiones estimadas, un blog educativo con artículos sobre qué esperar en sessiones y cómo la hipnoterapia actúa en la mente, y recursos de apoyo; también ofrece una llamada de descubrimiento gratuita de 15 minutos y grabaciones de seguimiento para consolidar el trabajo terapéutico. Lucía aparece en el directorio de la American Hypnotists Association y en HMI Nationally Accredited College of Hypnotherapy, presenta credenciales y un código ético profesional en el sitio, y muestra reseñas de clientes satisfechos que resaltan eficacia, profesionalismo, enfoque compasivo y resultados concretos (por ejemplo, abandono del tabaco y reducido estrés). La comunicación del centro enfatiza accesibilidad y flexibilidad (sesiones por videollamada seguras y efectivas), declaración de no sustitución médica y recomendación de consultar a un médico cuando corresponda, y una oferta amplia de aplicaciones de la hipnoterapia para problemas como control de ira, manejo del dolor, perfeccionismo, procrastinación, habla en público, motivación, fertilidad y recuperación de duelo, posicionando a Within Hypnosis como una opción integral para quienes buscan transformación personal, bienestar emocional y mejoras conductuales mediante hipnoterapia clínica y coaching CBT.",
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})

const c = virtualWebStore.createIfNotExists({
    host: "qadigitalads.com",
    pathname: "/",
    webSummary: {
        summary: "QA Digital Advertising (QA Digital Ads) es una agencia de marketing digital y diseño web con sede en Maryland que ofrece servicios integrales para empresas: diseño y desarrollo de sitios web (sitios informativos, landing pages, cursos online y eCommerce), campañas de Google y Facebook Ads, planes SEO personalizados con análisis de palabras clave y creación de contenido, producción de videos publicitarios profesionales y servicios de impresión (tarjetas de presentación premium, camisetas y otros materiales) con cotizaciones en línea y portales de pago seguro. Con oficinas en 706 Crain Highway North, Suite A, Glen Burnie, MD 21061 y 817 Silver Spring Ave, Silver Spring, MD 20910, contacto telefónico 240-593-6567 y correo hola@qadigitalads.com, la empresa atiende a clientes en todo Maryland (incluyendo Baltimore, Bethesda, Frederick, Greenbelt, Rockville, Elkridge, Ellicott City, Lanham, Annapolis, Odenton y Columbia) y la región del área metropolitana Washington D.C./Virginia. QA Digital Ads exhibe un portafolio de proyectos reales (por ejemplo bmalandscaping.com, wastealternatives.com, habibhealthandfitness.com) y declara más de 200 clientes y 60+ reseñas en Google; ofrece además reseñas y testimonios de clientes satisfechos, ejemplos de trabajos y la posibilidad de ver el portafolio completo. El equipo está liderado por Alfonso Quiñonez (Director ejecutivo) y Julián Quiñonez (Director financiero) e integra estrategas de contenido, diseñadores y desarrolladores seniors y junior, editores de video y gestores de proyecto, junto a un embajador de marca joven (Ariel) que refleja los valores de la empresa; la compañía promueve la participación comunitaria, patrocina talentos jóvenes y apoya a pequeñas empresas, incluidas firmas propiedad de minorías y mujeres, con asesoría y precios especiales. QA Digital Ads también dispone de herramientas de accesibilidad en su web, un chatbot (QA's AI Bot), políticas de privacidad y cookies visibles, ofertas de empleo y un formulario de contacto para solicitar proyectos o aplicar a vacantes, con énfasis en soluciones personalizadas y resultados medibles en posicionamiento y captación de clientes.",
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})

v.vdomStore.getOrCreate("/")
v2.vdomStore.getOrCreate("/")
c.vdomStore.getOrCreate("/")

const app = express()

app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())
AppRoutes(app)

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))