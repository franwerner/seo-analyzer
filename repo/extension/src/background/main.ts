import { getApiResponse } from "@seo-analyzer/common"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Map para guardar AbortControllers por tabId
const abortControllers = new Map<number, AbortController>()

// Mantener el service worker activo con alarms
chrome.alarms.create('keepAlive', { periodInMinutes: 0.4 })
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // El worker se mantiene activo
    }
})

// Limpiar estado cuando la pestaña se actualiza (refresh)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
        // Abortar fetch en progreso para esta pestaña
        const controller = abortControllers.get(tabId)
        if (controller) {
            controller.abort()
            abortControllers.delete(tabId)
        }

        // Limpiar historial y estado de análisis para esta pestaña
        chrome.storage.session.get(['analyzingTabId'], (result) => {
            if (result.analyzingTabId === tabId) {
                chrome.storage.session.set({ isAnalyzing: false, analyzingTabId: null })
            }
        })
        chrome.storage.session.remove([`analysisHistory_${tabId}`, 'activeAnalysisId'])
    }
})

// Interfaz para el historial de análisis
interface AnalysisHistoryItem {
    id: string
    timestamp: number
    type: string
    issuesCount: number
    result: any
}

// Función para guardar en el historial desde el background
function saveToHistory(tabId: number, result: any, success: boolean) {
    if (!success) return

    const storageKey = `analysisHistory_${tabId}`

    chrome.storage.session.get([storageKey, 'validationType'], (data) => {
        const history: AnalysisHistoryItem[] = data[storageKey] || []
        const validationType = data.validationType || 'complete'

        const newItem: AnalysisHistoryItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            type: validationType,
            issuesCount: result?.result?.issuesCount || 0,
            result: result
        }

        // Agregar al inicio y limitar a 10 items
        history.unshift(newItem)
        if (history.length > 10) history.pop()

        chrome.storage.session.set({
            [storageKey]: history,
            activeAnalysisId: newItem.id
        })
    })
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "startAnalysis") {
        const { tabId, url, htmlString, snapshotId, validationsSelected } = message

        // Crear AbortController para este análisis
        const controller = new AbortController()
        abortControllers.set(tabId, controller)

        // Guardar estado de análisis en progreso
        chrome.storage.session.set({ isAnalyzing: true, analyzingTabId: tabId })

            // Ejecutar el fetch de forma asíncrona
            ; (async () => {
                try {
                    const response = await fetch(`${BACKEND_URL}/virtual-dom/analyze`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            htmlString,
                            host: url.host,
                            pathname: url.pathname,
                            snapshotId,
                            validationsSelected
                        }),
                        signal: controller.signal
                    })

                    const result = await getApiResponse(response)

                    // Limpiar AbortController y estado de análisis
                    abortControllers.delete(tabId)
                    chrome.storage.session.set({ isAnalyzing: false, analyzingTabId: null })

                    // Guardar en historial desde el background (siempre funciona)
                    saveToHistory(tabId, result, response.ok)

                    // Enviar respuesta al content script
                    chrome.tabs.sendMessage(tabId, {
                        action: "response",
                        response: result
                    })

                    // Notificar al popup si está abierto (para actualizar UI)
                    chrome.runtime.sendMessage({
                        action: "analysisComplete",
                        success: response.ok,
                        result
                    }).catch(() => {
                        // Popup cerrado, ignorar error
                    })

                } catch (err) {
                    // Limpiar AbortController y estado de análisis en caso de error
                    abortControllers.delete(tabId)
                    chrome.storage.session.set({ isAnalyzing: false, analyzingTabId: null })

                    // No notificar si fue abortado (refresh de página)
                    if (err instanceof Error && err.name === 'AbortError') {
                        return
                    }

                    // Notificar error al popup si está abierto
                    chrome.runtime.sendMessage({
                        action: "analysisError",
                        error: err instanceof Error ? err.message : String(err)
                    }).catch(() => {
                        // Popup cerrado, ignorar error
                    })
                }
            })()

        // Retornar true para indicar que la respuesta será asíncrona
        return true
    } else if (message.action === "getAnalysisState") {
        // Responder con el estado actual del análisis
        chrome.storage.local.get(['isAnalyzing', 'analyzingTabId'], (result) => {
            chrome.runtime.sendMessage({
                action: "analysisState",
                isAnalyzing: result.isAnalyzing || false,
                analyzingTabId: result.analyzingTabId
            }).catch(() => {
                // Popup cerrado, ignorar error
            })
        })
        return true
    }
})

// Mantener conexión activa desde popup
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "keepAlive") {
        // La conexión mantiene el service worker activo
        port.onDisconnect.addListener(() => {
            // Popup cerrado, pero el fetch continúa
        })
    }
})
