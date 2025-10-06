import HTTPError from "./HTTP.error";

export default class EnvNotFountError extends HTTPError {
    constructor() {
        super({
            message: "Environment variable not found",
            status_code: 500,
            type: "EnvNotFountError"
        })
    }
}