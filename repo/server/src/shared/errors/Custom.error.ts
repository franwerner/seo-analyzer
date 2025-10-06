export interface CustomErrorProps {
    name: string
    message: string
}

export class CustomError extends Error {
    constructor({ name, message }: CustomErrorProps) {
        super(message)
        this.name = name
    }
}