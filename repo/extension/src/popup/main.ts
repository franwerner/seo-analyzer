const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Login elements
const loginContainer = document.querySelector("#login-container") as HTMLDivElement
const loginForm = document.querySelector("#login-form") as HTMLFormElement
const loginPassword = document.querySelector("#login-password") as HTMLInputElement
const loginButton = document.querySelector("#login-button") as HTMLButtonElement
const loginError = document.querySelector("#login-error") as HTMLSpanElement

// Main elements
const mainContainer = document.querySelector("#main-container") as HTMLDivElement
const analyzeButton = document.querySelector("#analyze-button") as HTMLButtonElement
const errorMessage = document.querySelector("#error-message") as HTMLSpanElement
const validationRadios = document.querySelectorAll('input[name="validation-type"]') as NodeListOf<HTMLInputElement>
const historyList = document.querySelector("#history-list") as HTMLDivElement

// Registration elements
const registrationTooltip = document.querySelector("#registration-tooltip") as HTMLSpanElement
const registrationIcon = document.querySelector("#registration-icon") as HTMLSpanElement
const registerButton = document.querySelector("#register-button") as HTMLButtonElement

// Analysis history type
interface AnalysisHistoryItem {
  id: string
  timestamp: number
  type: string
  issuesCount: number
  result: any
}

// Render history list
function renderHistory(history: AnalysisHistoryItem[], activeId?: string) {
  historyList.innerHTML = ""

  if (history.length === 0) {
    const empty = document.createElement("div")
    empty.className = "history-empty"
    empty.textContent = "No analyses yet"
    historyList.appendChild(empty)
    return
  }

  history.forEach(item => {
    const div = document.createElement("div")
    div.className = `history-item ${item.id === activeId ? 'active' : ''}`

    const info = document.createElement("div")
    info.className = "history-item-info"

    const type = document.createElement("span")
    type.className = "history-item-type"
    type.textContent = item.type

    const time = document.createElement("span")
    time.className = "history-item-time"
    time.textContent = new Date(item.timestamp).toLocaleTimeString()

    info.appendChild(type)
    info.appendChild(time)

    const issues = document.createElement("span")
    issues.className = "history-item-issues"
    issues.textContent = item.issuesCount.toString()

    div.appendChild(info)
    div.appendChild(issues)

    div.addEventListener("click", () => {
      // Send result to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, {
          action: "response",
          response: item.result
        })
      })

      // Update active state
      chrome.storage.session.set({ activeAnalysisId: item.id })
      renderHistory(history, item.id)
    })

    historyList.appendChild(div)
  })
}

// Load history on startup
function loadHistory() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id!
    chrome.storage.session.get([`analysisHistory_${tabId}`, 'activeAnalysisId'], (result) => {
      const history = result[`analysisHistory_${tabId}`] || []
      renderHistory(history, result.activeAnalysisId)
    })
  })
}

// Restaurar estado del radio button
chrome.storage.session.get(['validationType'], (result) => {
  if (result.validationType) {
    const radio = document.querySelector(`input[name="validation-type"][value="${result.validationType}"]`) as HTMLInputElement
    if (radio) radio.checked = true
  }
})

// Guardar estado cuando cambie el radio button
validationRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    chrome.storage.session.set({ validationType: radio.value })
  })
})

// Función para deshabilitar/habilitar controles durante análisis
function setAnalyzingState(isAnalyzing: boolean) {
  analyzeButton.textContent = isAnalyzing ? "Analyzing..." : "Analyze"
  analyzeButton.disabled = isAnalyzing
  if (isAnalyzing) {
    analyzeButton.classList.add("analyzing")
  } else {
    analyzeButton.classList.remove("analyzing")
  }
  validationRadios.forEach(radio => {
    radio.disabled = isAnalyzing
  })
}

// Verificar si la web actual está registrada
async function checkRegistration() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = new URL(tabs[0].url!)
    const host = url.host
    const pathname = url.pathname

    try {
      // Primero verificar si el host está registrado
      const hostResponse = await fetch(`${BACKEND_URL}/virtual-web/by-host?host=${encodeURIComponent(host)}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!hostResponse.ok) {
        // Error, no mostrar nada
        registrationIcon.style.display = "none"
        registerButton.style.display = "none"
        return
      }

      const hostData = await hostResponse.json()

      if (!hostData.result) {
        // Host no registrado - mostrar ✗
        registrationTooltip.textContent = "Web not registered"
        registrationTooltip.className = "not-registered"
        registrationTooltip.style.display = "block"
        registrationIcon.textContent = "✗"
        registrationIcon.className = "not-registered"
        registrationIcon.style.display = "flex"
        registerButton.style.display = "none"
        return
      }

      // Host registrado, ahora verificar el pathname
      const domResponse = await fetch(`${BACKEND_URL}/virtual-dom/by-host-path?host=${encodeURIComponent(host)}&pathname=${encodeURIComponent(pathname)}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (domResponse.ok) {
        const domData = await domResponse.json()
        if (domData.result) {
          // Pathname registrado - mostrar ✓
          registrationTooltip.textContent = "Path registered"
          registrationTooltip.className = "registered"
          registrationTooltip.style.display = "block"
          registrationIcon.textContent = "✓"
          registrationIcon.className = "registered"
          registrationIcon.style.display = "flex"
          registerButton.style.display = "none"
        } else {
          // Pathname no registrado - mostrar ⚠ y botón
          registrationTooltip.textContent = "Path not registered"
          registrationTooltip.className = "warning"
          registrationTooltip.style.display = "block"
          registrationIcon.textContent = "⚠"
          registrationIcon.className = "warning"
          registrationIcon.style.display = "flex"
          registerButton.style.display = "block"
        }
      } else {
        // Error al verificar pathname - mostrar ⚠ y botón
        registrationTooltip.textContent = "Path not registered"
        registrationTooltip.className = "warning"
        registrationTooltip.style.display = "block"
        registrationIcon.textContent = "⚠"
        registrationIcon.className = "warning"
        registrationIcon.style.display = "flex"
        registerButton.style.display = "block"
      }
    } catch {
      // Error de conexión, no mostrar nada
      registrationTooltip.style.display = "none"
      registrationIcon.style.display = "none"
      registerButton.style.display = "none"
    }
  })
}

// Registrar la web actual
async function registerWeb() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = new URL(tabs[0].url!)
    const host = url.host
    const pathname = url.pathname

    registerButton.textContent = "Registrando..."
    registerButton.disabled = true

    try {
      // Obtener el VirtualWeb existente (ya sabemos que existe porque el botón solo aparece si está registrado)
      const webResponse = await fetch(`${BACKEND_URL}/virtual-web/by-host?host=${encodeURIComponent(host)}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!webResponse.ok) {
        throw new Error('Error obteniendo VirtualWeb')
      }

      const webData = await webResponse.json()

      if (!webData.result) {
        throw new Error('VirtualWeb no encontrado')
      }

      const virtualWebId = webData.result.id

      // Crear el VirtualDom para el pathname
      const domResponse = await fetch(`${BACKEND_URL}/virtual-dom/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ virtualWebId, pathname })
      })

      if (!domResponse.ok) {
        throw new Error('Error creando VirtualDom')
      }

      // Registro exitoso - mostrar ✓
      registrationTooltip.textContent = "Web registered"
      registrationTooltip.className = "registered"
      registrationTooltip.style.display = "block"
      registrationIcon.textContent = "✓"
      registrationIcon.className = "registered"
      registrationIcon.style.display = "flex"
      registerButton.style.display = "none"
    } catch (err) {
      errorMessage.textContent = err instanceof Error ? err.message : 'Error registrando web'
      errorMessage.style.display = "block"
      registerButton.textContent = "Register Web"
      registerButton.disabled = false
    }
  })
}

// Event listener para el botón de registro
registerButton.addEventListener("click", registerWeb)

// Verificar autenticación al abrir el popup
async function checkAuth() {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/ping`, {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      // Usuario autenticado, mostrar contenido principal
      loginContainer.style.display = "none"
      mainContainer.style.display = "block"

      // Verificar registro de la web actual
      checkRegistration()

      // Cargar historial de análisis
      loadHistory()

      // Restaurar estado de análisis
      chrome.storage.session.get(['isAnalyzing', 'analyzingTabId'], (result) => {
        if (result.isAnalyzing) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id === result.analyzingTabId) {
              setAnalyzingState(true)
            }
          })
        }
      })
    } else {
      // No autenticado, mostrar login
      loginContainer.style.display = "block"
      mainContainer.style.display = "none"
    }
  } catch {
    // Error de conexión, mostrar login
    loginContainer.style.display = "block"
    mainContainer.style.display = "none"
    loginError.textContent = "Error de conexión con el servidor"
    loginError.style.display = "block"
  }
}

// Manejar login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const password = loginPassword.value
  loginButton.textContent = "Entrando..."
  loginButton.disabled = true
  loginError.style.display = "none"

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ password })
    })

    if (response.ok) {
      // Login exitoso
      loginContainer.style.display = "none"
      mainContainer.style.display = "block"
      loginPassword.value = ""

      // Verificar registro de la web actual
      checkRegistration()
    } else {
      const result = await response.json()
      loginError.textContent = result.error || "Contraseña incorrecta"
      loginError.style.display = "block"
    }
  } catch {
    loginError.textContent = "Error de conexión con el servidor"
    loginError.style.display = "block"
  } finally {
    loginButton.textContent = "Entrar"
    loginButton.disabled = false
  }
})

// Verificar auth al cargar
checkAuth()

// Escuchar respuestas del background service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "analysisComplete") {
    if (message.success) {
      // El historial ya fue guardado por el background, solo recargar para actualizar la UI
      loadHistory()
    } else {
      errorMessage.style.display = "block"
      errorMessage.textContent = message.result?.error || "Error analyzing page"
    }
    setAnalyzingState(false)
  } else if (message.action === "analysisError") {
    errorMessage.style.display = "block"
    errorMessage.textContent = message.error
    setAnalyzingState(false)
  }
})

analyzeButton.addEventListener("click", () => {
  // Mantener conexión con el service worker
  chrome.runtime.connect({ name: "keepAlive" })

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id!
    const url = new URL(tabs[0].url!)

    try {
      // Cambiar el estado a analizando
      setAnalyzingState(true)
      errorMessage.style.display = "none"

      // Enviar mensaje al content script para obtener el HTML
      chrome.tabs.sendMessage(tabId, {
        action: "analyzePage",
        url: {
          host: url.host,
          pathname: url.pathname || "/"
        }
      }, ({ htmlString, snapshotId }) => {
        // Obtener el tipo de validación seleccionado
        const validationType = (document.querySelector('input[name="validation-type"]:checked') as HTMLInputElement)?.value || 'complete'

        // Configurar validaciones según la selección
        const validationsSelected = validationType === 'complete'
          ? {
            scheme: true,
            semantic: true,
            spelling: true,
            resource: true,
            structure: true
          }
          : {
            spelling: true,
          }

        // Enviar al background service worker para hacer el fetch
        chrome.runtime.sendMessage({
          action: "startAnalysis",
          tabId,
          url: {
            host: url.host,
            pathname: url.pathname || "/"
          },
          htmlString,
          snapshotId,
          validationsSelected
        })
      })
    } catch (err) {
      errorMessage.style.display = "block"
      errorMessage.textContent = err as any
      setAnalyzingState(false)
    }
  })
})