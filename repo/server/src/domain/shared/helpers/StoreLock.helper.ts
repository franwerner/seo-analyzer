

/**
 * StoreLockHelper
 *
 * Permite ejecutar una promesa por recurso (`id`) solo una vez a la vez.
 * Si varias llamadas ocurren simultáneamente para el mismo `id`, todas reciben
 * la misma promesa/resultado. Se libera el lock cuando la promesa termina.
 * Basicamente resuleve problemas de condicion de carrera asociada a un mismo recurso.
 *
 * 
 */

export default class StoreLockHelper<T> {
    locked: Map<number, Promise<T>> = new Map()

    async lock(id: number, fn: () => Promise<T>) {
        const getLocked = this.locked.get(id)
        if (getLocked) return getLocked
        const promise = fn()
        this.locked.set(id, promise)
        try {
            await promise
        } catch (error) {
            throw error
        }
        finally {
            this.unlock(id)
        }
        return promise
    }

    getLock(id: number) {
        return this.locked.get(id)
    }

    private unlock(id: number) {
        this.locked.delete(id)
    }

}
