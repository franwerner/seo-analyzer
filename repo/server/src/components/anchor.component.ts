import type { Issues } from "../schemas/issues.schema";
import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";

class AnchorComponent extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)
    }

    private async validateHref() {
        const href = this.attributes.href
        const isBlackHoleHref = href?.includes("blackhole")
        if (!isValidHttpUrl(this.attributes.href) || isBlackHoleHref) return true
        try {
            const res = await fetch(this.attributes.href, {
                method: "HEAD",
            })
            return ![404, 500, 504].includes(res.status)
        } catch (error) { }

    }

    async validate(): Promise<Issues> {
        const isValid = await this.validateHref()
        if (!isValid) {
            return [{
                message: `${this.attributes.href} NO RESPONDE`,
                traceIds: [this.traceId],
                tag: this.tag
            }]
        }
        return []
    }

}

export default AnchorComponent
