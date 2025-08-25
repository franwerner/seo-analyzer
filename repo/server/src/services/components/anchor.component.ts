import isValidHttpUrl from "../../utils/isValidHttpUrl.util";
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
            const res = await fetch(this.attributes.href)
            return !(res.status === 404 || res.status >= 500);
        } catch (error) {
            return false
        }
    }

    async validate() {
        const isValid = await this.validateHref()
        let issues: Issues = await super.validate()
        if (!isValid) {
            issues.push({
                message: `${this.attributes.href} NO RESPONDE`,
                type: "error",
                hash: this.hash
            })
        }
        return [...issues, ...this.issues]
    }

}

export default AnchorComponent
