import puppeteer, { Browser, Page } from "puppeteer";
import ErrorHandler from "../utils/errorHandler.utils";

class PuppeterService {
    private browser: Browser | null = null
    private page: Page | null = null
    private queue: Array<string> = []
    constructor() { }

    async launch() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        return this.browser
    }

    assertBrowser() {
        if (!this.browser) {
            throw new ErrorHandler({
                message: "Browser not initialized",
                status_code: 500
            })
        }
        return this.browser
    }

    async close() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }

    async getOrCreatePage() {
        if (!this.page) {
            this.page = await this.newPage()
        }
        return this.page
    }

    async newPage() {
        const browser = this.assertBrowser()
        return browser.newPage()
    }
}
export default PuppeterService
