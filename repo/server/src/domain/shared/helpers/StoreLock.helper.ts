

/**
 * StoreLockHelper
 *
 * Permite ejecutar una promesa por recurso (`id`) solo una vez a la vez.
 * Si varias llamadas ocurren simultáneamente para el mismo `id`, todas reciben
 * la misma promesa/resultado. Se libera el lock cuando la promesa termina.
 * Basicamente resuleve problemas de condicion de carrera asociada a un mismo recurso.
 *
 */

export default class StoreLockHelper<T> {
    private locked: Map<number, Promise<T>> = new Map()

    lock(id: number, fn: () => Promise<T>) {
        const getLocked = this.locked.get(id)
        if (getLocked) return getLocked
        const promise = fn()
        this.locked.set(id, promise)
        promise.finally(() => this.unlock(id))
        return promise
    }


    private unlock(id: number) {
        this.locked.delete(id)
    }

}
