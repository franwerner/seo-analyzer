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

    canBeUsedInBranch() {
        const href = this.attributes.href
        const hasBlackHole = href?.includes("blackhole")
        return !hasBlackHole
    }

    async validate(): Promise<Issues> {
        const isInvalid = !(await this.validateHref())
        if (isInvalid) {
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
