import EnvNotFountError from "../errors/EnvNotFount.error"

interface Env {
    JWT_SECRET: string
    HASH_PASSWORD: string
    OPENAI_KEY: string
    CLIENT_URL: string
    NODE_ENV: string
    PORT: number
}

const getEnsureEnv = (key: keyof Env) => {
    if (!process.env[key]) {
        throw new EnvNotFountError()
    }
    return process.env[key]
}

export default getEnsureEnv