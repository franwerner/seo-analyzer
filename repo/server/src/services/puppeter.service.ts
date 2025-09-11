import puppeteer, { Browser } from "puppeteer";
import ErrorHandler from "../utils/errorHandler.utils";

const MAX_ACTIVE_PAGES = 5

class PuppeterService {

    private browser: null | Promise<Browser> = null
    private pages_count = 0

    /**
     * En un futuro se debera agregar una cola de ESPERA para aquella instancia de paginas que no se puedan crear por que se supera el limite. 
     */

    constructor() { }

    private async launch() {
        return await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
    }

    private async getOrCreateBrowser() {
        /**
         * Se almacena la promesa del browser para evitar condicion de carrera, 
         * entonces siempre asegura una unica instacia del browser.
         */
        if (!this.browser) {
            const launch = this.launch()
            this.browser = launch
            return await launch
        }
        return this.browser
    }

    private async removeBrowser() {
        if (this.browser) {
            (await this.browser).close()
            this.browser = null
        }
    }

    private setIncrementPageIfAvailable() {
        if (this.pages_count >= MAX_ACTIVE_PAGES) {
            throw new ErrorHandler({
                message: `Max active pages reached. ${this.pages_count}/${MAX_ACTIVE_PAGES}`,
                status_code: 503
            })
        }
        this.pages_count++
    }

    private setDecrementPage() {
        if (this.pages_count > 0) this.pages_count--
    }

    async newPageIfAvailable() {
        const browser = await this.getOrCreateBrowser()
        /**
         * El conteo se hace inclusive antes de crear la pagina
         * para evitar condicion de carrera.
         * y que las proximas ejecucciones ya tenga en cuenta
         * el conteo.
         */
        this.setIncrementPageIfAvailable()
        try {
            const page = await browser.newPage()
            page.once("close", () => {
                this.setDecrementPage()
                if (this.pages_count == 0) this.removeBrowser()
            })
            return async (path: string) => {
                try {
                    await page.goto(path)
                    const content = await page.content()
                    await page.close()
                    return content
                } catch (error) {
                    await page.close()
                    throw error
                }
            }
        } catch (error) {
            /**Por si la creacion del pagina falla, se tiene que decrementar el conteo que se hizo antes. */
            this.setDecrementPage()
            throw error
        }
    }
}
export default PuppeterService
