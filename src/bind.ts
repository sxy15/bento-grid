import { Ref } from "vue";
import { BentoGridProps, BindOps } from "./types";

let opts: BindOps

const binds: [keyof HTMLElementEventMap, (ev: PointerEvent | any) => any][] = [
  ['pointerdown', pointerdown],
  ['pointermove', pointermove],
  ['pointerup', pointerup]
]

export function initBind(ref: Ref<HTMLElement | null>, _opts: BindOps) {
  const el = ref.value
  if(!el) return

  opts = _opts

  binds.forEach(([eventType, handler]) => {
    el.addEventListener(eventType, handler, false)
  })
}

export function unBind(ref: Ref<HTMLElement | null>) {
  const el = ref.value
  if(!el) return
  
  binds.forEach(([eventType, handler]) => {
    el.removeEventListener(eventType, handler, false)
  })
}

function pointerdown(ev: PointerEvent) {
  const id = getPointItemId(ev)

  opts.draggingId.value = id
}

function pointermove(ev: PointerEvent) {
  console.log('pointermove', ev)
}

function pointerup(ev: PointerEvent) {}

function getPointItemId(ev: PointerEvent) {
  const { clientX, clientY } = ev
  let pointEle = document.elementFromPoint(clientX, clientY)

  while(pointEle && !pointEle.classList.contains('bento-grid-item')) {
    pointEle = pointEle.parentElement
  }

  let id = pointEle?.getAttribute('id')

  if(id) {
    const grid = opts.grids.value.find(grid => id === `${opts.props.prefix}-${grid.id}`)

    return grid?.id
  }
}