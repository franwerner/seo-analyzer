export interface CustomErrorProps {
    name: string
    message: string
}

export class CustomError extends Error {
    constructor({ name, message }: CustomErrorProps, cause?: unknown) {
        super(message, { cause })
        this.name = name
    }
}