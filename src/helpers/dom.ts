export function addWindowEventListener(
  eventType: keyof HTMLElementEventMap, 
  handler: () => void
): void {
  window.addEventListener(eventType, handler)
}

export function removeWindowEventListener(
  eventType: keyof HTMLElementEventMap, 
  handler: () => void
): void {
  window.removeEventListener(eventType, handler)
}

export const isArray = Array.isArray
