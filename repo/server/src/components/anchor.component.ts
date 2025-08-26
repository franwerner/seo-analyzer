import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps, Issues } from "./base.component";
import BaseComponent from "./base.component";

class AnchorComponent extends BaseComponent {

    static pickableAttributes = ["href"];

    constructor(props: BaseComponentProps) {
        super(props)
    }

    private async validateHref() {
        if (!isValidHttpUrl(this.attributes.href)) return true
        try {
            const res = await fetch(this.attributes.href, {
                method: "HEAD"
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
            this.issues.push({
                message: `${this.attributes.href} NO RESPONDE`,
                type: "warning",
                hash: this.hash
            })
        }
        return this.issues
    }

}

export default AnchorComponent
