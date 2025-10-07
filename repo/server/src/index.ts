import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./http/middlewares/errorGlobal.middleware";
import corsConfig from "./infrastructure/config/cors.config";
import AppRoutes from "./http/routes";
import { virtualWebStore } from "./infrastructure/bootstrap";
import { webSummaryContext } from "./infrastructure/mocks/webSummaryContext.mock";


const v = virtualWebStore.createIfNotExists({
    host: "atticsexpress.com",
    pathname: "/",
    webSummary: {
        summary: webSummaryContext,
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})

const c = virtualWebStore.createIfNotExists({
    host: "qadigitalads.com",
    pathname: "/",
    webSummary: {
        summary: 'QA Digital Advertising (QA Digital Ads) es una agencia de marketing digital radicada en Maryland, con oficinas en Glen Burnie y Silver Spring, que ofrece servicios integrales de diseño y desarrollo web, publicidad en Google y Facebook, SEO local y posicionamiento, producción de videos publicitarios y servicios de impresión personalizados. Su enfoque principal es ayudar a pequeñas y medianas empresas —incluyendo negocios dirigidos por minorías y mujeres— a crecer en línea mediante sitios web a medida (sitios informativos, landing pages, ecommerces y cursos online), campañas publicitarias optimizadas en las principales plataformas, análisis de keywords y creación de contenido para crecimiento orgánico, además de materiales físicos como tarjetas de presentación y merchandising. El sitio destaca un portafolio de proyectos reales, testimonios y más de 60 reseñas en Google con más de 200 clientes atendidos, ofrece planes SEO personalizados, cotizaciones de impresión, pagos seguros a través de portales en línea y herramientas de accesibilidad en la web; también presenta al equipo multidisciplinario (diseñadores, desarrolladores, estrategas de contenido y editores) y su compromiso comunitario en el área DC–Maryland–Virginia, incluyendo patrocinios y apoyo a programas locales. QA Digital Ads comunica claramente sus áreas de servicio, cobertura geográfica en múltiples ciudades de Maryland, opciones de contacto y contratación de personal, y se posiciona como un socio práctico para negocios que buscan aumentar visibilidad, conversiones y profesionalismo tanto en plataformas digitales como en materiales impresos.',
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})

v.vdomStore.getOrCreate("/")

const app = express()

app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())
AppRoutes(app)

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))