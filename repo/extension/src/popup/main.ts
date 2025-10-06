import { AnalyzeInterface } from "~/types/analyzeInterface.type"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const analyzeButton = document.querySelector("#analyze-button") as HTMLButtonElement
const analysisContainer = document.querySelector("#analysis-container") as HTMLDivElement
const errorMessage = document.querySelector("#error-message") as HTMLSpanElement

let selectedIndex: number | null = null

let analysisData: Array<AnalyzeInterface> = []

function renderAnalysisList(tabsId: number) {
  analysisContainer.innerHTML = ""

  analysisData.forEach((analysis, index) => {
    const item = document.createElement("button")
    item.className = "analysis-item"
    if (selectedIndex === index) item.classList.add("selected")

    item.textContent = `Análisis ${index + 1} - Errores: ${analysis.issues.length}`

    item.onclick = () => {
      selectedIndex = index
      renderAnalysisList(tabsId)
      chrome.tabs.sendMessage(tabsId, { action: "getIssues", res: { data: analysis, ok: true } })
    }
    analysisContainer.appendChild(item)
  })
}

async function fetchAnalysis({ host, path }: { host: string, path: string }): Promise<Array<AnalyzeInterface>> {
  const res = await fetch(`${BACKEND_URL}/virtual-web/analysis?host=${host}&path=${path}`, { credentials: "include" })
  const json = (await res.json())
  if (!res.ok) throw new Error(json.message || "Error getting analysis")
  const data = json as { analysis: Array<AnalyzeInterface> }
  return data.analysis
}

analyzeButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id!
    try {
      const url = new URL(tabs[0].url!)
      const data = await fetchAnalysis({ host: url.host, path: url.pathname })
      analyzeButton.style.display = "none"
      errorMessage.style.display = "none"
      analysisData = data
      renderAnalysisList(tabId)
    } catch (err) {
      errorMessage.style.display = "block"
      errorMessage.textContent = err as any
    }
  })
})