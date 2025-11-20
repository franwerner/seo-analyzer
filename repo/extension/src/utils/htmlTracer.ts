import { v4 as uuid } from "uuid"
import crc32 from "crc-32"

/**
 * Recorre todo el árbol HTML y agrega trace-id a cada elemento directamente en el DOM
 * @param rootElement El elemento raíz desde donde comenzar (por defecto document.documentElement)
 * @returns El HTML con los trace-ids agregados
 */

export function addTraceIdsToHtml(rootElement: Element = document.documentElement, mapDom: Map<string, Element>) {

  function traverseAndAddTraceId(element: Element): void {
    const traceId = crc32.str(uuid()).toString();
    element.setAttribute('trace-id', traceId);
    mapDom.set(traceId, element)
    const children = Array.from(element.children);
    children.forEach(child => {
      traverseAndAddTraceId(child);
    });
  }
  traverseAndAddTraceId(rootElement);
  return {
    htmlString: rootElement.outerHTML,
    snapshotId: `snapshot_${rootElement.getAttribute("trace-id")}`,
    mapDom
  }
}

/**
 * Obtiene el HTML completo de la página con trace-ids editados directamente en el DOM
 */
export function getTracedHtml(mapDom: Map<string, Element>) {
  const htmlElement = document.querySelector("html")
  if (!htmlElement) throw new Error("No se encontro el elemento html")
  const htmlTraced = htmlElement.getAttribute("trace-id")
  if (htmlTraced) {
    return {
      htmlString: document.documentElement.outerHTML,
      snapshotId: `snapshot_${htmlTraced}`,
    }
  }
  return addTraceIdsToHtml(document.documentElement, mapDom);
}
