import type { Issues } from "../schemas/issues.schema";
import isValidHttpUrl from "../utils/isValidHttpUrl.util";
import type { BaseComponentProps } from "./base.component";
import BaseComponent from "./base.component";

class AnchorComponent extends BaseComponent {

    constructor(props: BaseComponentProps) {
        super(props)

    }

    protected shouldIgnore() {
        const att = this.attributes
        const isBlackHoleHref = att.href?.includes("blackhole")
        return isBlackHoleHref
    }

    private async validateHref() {
        const href = this.attributes.href
        if (!isValidHttpUrl(href)) return true
        try {
            const res = await fetch(href, {
                method: "HEAD",
            })
            return ![404, 500, 504].includes(res.status)
        } catch (error) { }

    }

    async validate(): Promise<Issues> {
        const isInvalid = !(await this.validateHref())
        if (isInvalid) {
            return [{
                message: `${this.attributes.href} LINK BROKEN`,
                traceIds: [this.traceId],
                tag: this.tag
            }]
        }
        return []
    }

}

export default AnchorComponent
