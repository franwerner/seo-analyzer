import { Issue } from "@/infrastructure/schemas/issue.schema";
import BaseComponent from "./base.component";

export type ValidateReturn = Issue | Array<Issue> | undefined

export default abstract class BaseValidatableComponent extends BaseComponent {
    validateResource?(): Promise<ValidateReturn>
    validateSemantic?(): ValidateReturn
    validateStructure?(): ValidateReturn
}