import VDomContext from "@/domain/virtual-dom/context/vDom.context";
import { IssueType } from "@/schemas/issueType.schema";
import OpenAi from "@/services/openAi.service";
import ValidationUtility from "@/domain/virtual-dom/utils/validation.util";

export default class SemanticValidation extends ValidationUtility {
    constructor(
        private openAI: OpenAi,
        private domContext: VDomContext
    ) {
        super()
    }

    validate() {

        this.openAI.generateIssuesAsType(
            "",
            "",
            IssueType.SEMANTIC
        )

    }

}