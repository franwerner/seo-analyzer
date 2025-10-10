
export interface URLInterface {
    host: string
    pathname: string
    href: string
    origin: string
}


export default class URLUtility {
    private static patternURL = /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s?#]*)?(\?[^\s#]*)?(#\S*)?$/

    static normalizePathname(pathname: string) {

        let normalizedPathname = pathname.trim()

        if (!pathname.startsWith("/")) normalizedPathname = `/${pathname}`

        /**
         * Siempre retornar con / al final
         * EJ : 
         * / -> /
         * /about -> /about/
         * void -> /
         */

        if (!normalizedPathname.endsWith("/")) normalizedPathname = `${normalizedPathname}/`

        return normalizedPathname
    }

    static isValidURL(url: string) {
        //Analiza si un URL valida sin el HASH.
        return this.patternURL.test(url);
    }

    static normalizeHost(host: string): string {
        return host.trim().replaceAll("/", "");
    }

    static createURL({ host, pathname }: { host: string, pathname: string }): URLInterface {
        const normalizedPathname = this.normalizePathname(pathname)
        const normalizedHost = this.normalizeHost(host)

        /**
         * href, origin y pathname siempre deben devolver un `/` al final.
         */

        return {
            host: normalizedHost,
            pathname: normalizedPathname,
            href: `https://${normalizedHost}${normalizedPathname}`,
            origin: `https://${normalizedHost}/`
        }
    }

}