import VDomContext from "@/context/vDom.context";
import ValidationUtility from "@/utils/validation.util";

export default class HeadingsValidation extends ValidationUtility {
    context: VDomContext

    constructor(context: VDomContext) {
        super()
        this.context = context
    }

    private validateH1() {
        const h1 = this.context.headings.h1

        if (h1.length > 1) {
            this.addIssue({
                message: "The webpage contains more than one h1 element",
                tag: "H1",
                traceIds: h1.map(h => h.traceId)
            })
        } else if (h1.length === 0) {
            this.addIssue({
                message: "No h1 found",
                tag: "H1",
                traceIds: ["-0"]
            })
        }
    }

    private validateH2() {
        const h2 = this.context.headings.h2
        if (h2.length > 10) {
            this.addIssue({
                message: "The webpage contains more than 10 h2 elements",
                tag: "H2",
                traceIds: h2.map(h => h.traceId)
            })
        }
    }

    validate() {
        this.validateH1()
        this.validateH2()
    }
}