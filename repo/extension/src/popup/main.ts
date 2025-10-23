import { getApiResponse, GetVirtualDomAnalysesDTO, GetVirtualDomAnalysisDTO, VirtualDom } from "@seo-analyzer/common"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const analyzeButton = document.querySelector("#analyze-button") as HTMLButtonElement
const analysisContainer = document.querySelector("#analysis-container") as HTMLDivElement
const errorMessage = document.querySelector("#error-message") as HTMLSpanElement
const moreButton = document.querySelector("#analyze-button-more") as HTMLButtonElement
moreButton.style.display = "none"
let selectedIndex: number | null = null

let analyses: GetVirtualDomAnalysesDTO["virtualDomAnalyses"] = []

async function renderAnalysisList(tabsId: number, virtualDom: VirtualDom, skip: number = 0) {
  moreButton.style.display = "none"

  try {
    analysisContainer.innerHTML = ""
    const analysisData = await fetch(`${BACKEND_URL}/virtual-dom/${virtualDom.id}/analyses?skip=${skip}`, { credentials: "include" })
    const { result } = await getApiResponse<GetVirtualDomAnalysesDTO>(analysisData)
    const { virtualDomAnalyses, pagination } = result
    analyses.push(...virtualDomAnalyses)
    analyses.forEach((analysis, index) => {
      const item = document.createElement("button")
      item.className = "analysis-item"
      if (selectedIndex === index) item.classList.add("selected")

      item.textContent = `Analysis #${analysis.id} - Issues: ${analysis.issuesCount}`

      item.onclick = async () => {
        const analysisData = await fetch(`${BACKEND_URL}/virtual-dom/analyses/${analysis.id}?skip=0`, { credentials: "include" })
        const { result } = await getApiResponse<GetVirtualDomAnalysisDTO>(analysisData)
        chrome.tabs.sendMessage(tabsId, { action: "getIssues", res: { data: result.analysisIssues, ok: true } })
      }
      analysisContainer.appendChild(item)
      if (pagination.next.has) {
        moreButton.style.display = "block"
        moreButton.onclick = () => {
          renderAnalysisList(tabsId, virtualDom, pagination.next.skip)
        }
      }
    })
  } catch (error) {
    errorMessage.style.display = "block"
    errorMessage.textContent = error as any
  }
}

async function fetchVirtualDom({ host, pathname }: { host: string, pathname: string }): Promise<VirtualDom> {
  const res = await fetch(`${BACKEND_URL}/virtual-dom/by-host-path?host=${host}&pathname=${pathname}`, { credentials: "include" })
  return (await getApiResponse<VirtualDom>(res)).result
}

analyzeButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id!
    const url = new URL(tabs[0].url!)
    try {
      const data = await fetchVirtualDom({ host: url.host, pathname: url.pathname || "/" })
      analyzeButton.style.display = "none"
      errorMessage.style.display = "none"
      renderAnalysisList(tabId, data)
    } catch (err) {
      errorMessage.style.display = "block"
      errorMessage.textContent = err as any
    }
  })
})