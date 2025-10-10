import BaseComponent from "./base.component";
import { Issue } from "../types/Issue.interface"

export type ValidateReturn = Issue | Array<Issue> | undefined

export default abstract class BaseValidatableComponent extends BaseComponent {
    validateResource?(): Promise<ValidateReturn>
    validateSemantic?(): ValidateReturn
    validateStructure?(): ValidateReturn
}