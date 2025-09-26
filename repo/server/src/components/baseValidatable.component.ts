import { Issue } from "@/schemas/issues.schema";
import BaseComponent from "./base.component";

export default abstract class BaseValidatableComponent extends BaseComponent {
    abstract validate(): Promise<Issue | Array<Issue> | undefined>
}