import { URLInterface } from "@/types/URL.interface"

export default class URLUtility {
    static normalizePathname(pathname: string) {
        //Siempre retornar con / al inicio y sin el ultimo slash
        const pathWithoutLastSlash = pathname.replace(/\/$/, "")
        if (!pathWithoutLastSlash.startsWith("/")) return `/${pathWithoutLastSlash}`
        return pathWithoutLastSlash
    }

    static createURL({ host, pathname }: { host: string, pathname: string }): URLInterface {
        const normalizedPathname = this.normalizePathname(pathname)
        return {
            host,
            pathname: normalizedPathname,
            href: `https://${host}${normalizedPathname}`
        }
    }

}