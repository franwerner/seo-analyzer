import ErrorHandler from "./errorHandler.utils"

interface Env {
    JWT_SECRET: string
    HASH_PASSWORD: string
    OPENAI_KEY: string
    CLIENT_URL: string
}

const getEnsureEnv = (key: keyof Env) => {
    if (!process.env[key]) {
        throw new ErrorHandler({
            message: `Missing env variable: ${key}`,
            status_code: 500
        })
    }
    return process.env[key]
}

export default getEnsureEnv