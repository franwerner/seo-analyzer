import type { Issues } from "../schemas/issues.schema";
import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";

class AnchorComponent extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    private async validateHref() {
        if (!isValidHttpUrl(this.attributes.href)) return true
        try {
            const res = await fetch(this.attributes.href, {
                method: "HEAD",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9"
                }

            })
            const notFound = res.status === 404
            const notResponseServer = res.status >= 500
            return !(notFound || notResponseServer);
        } catch (error) {
            return false
        }
    }

    async validate(): Promise<Issues> {
        const isValid = await this.validateHref()
        if (!isValid) {
            return [{
                message: `${this.attributes.href} NO RESPONDE`,
                traceIds: [this.traceId],
                tag: this.nodeName
            }]
        }
        return []
    }

}

export default AnchorComponent
