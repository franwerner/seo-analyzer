
/**
 * Nos ayuda a manter la informacion global de la extension, para poder resetear la inyeccion.
 */


const global: {
    cleanupFns: (() => void)[]
    navButtons: Map<HTMLElement, HTMLElement>
    toggleBtn: HTMLElement | null
    activeTooltip: HTMLElement | null
} = {
    cleanupFns: [],
    navButtons: new Map(),
    toggleBtn: null,
    activeTooltip: null
}

export default global
