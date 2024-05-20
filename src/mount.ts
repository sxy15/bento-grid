import { Ref } from "vue";
import { BindOps } from "./types";

let opts: BindOps
let draggingStartPoint: { x: number, y: number }
let startX, startY, endX, endY, velocityX, velocityY;

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
    window.addEventListener(eventType, handler, false)
  })
  addEventListener('pointerdown', (e) => {
    e.preventDefault()
  }, false)
}

export function unBind(ref: Ref<HTMLElement | null>) {
  const el = ref.value
  if(!el) return
  
  binds.forEach(([eventType, handler]) => {
    el.removeEventListener(eventType, handler, false)
  })
}

const maxSpeed = 10;
const maxAngle = 30;
const fixedCoefficient = 0.8;
let moveStartTime;
let moveCounter = 0
function pointerdown(ev: PointerEvent) {
  ev.preventDefault();
  const id = getPointItemId(ev)  
  if(!id) return
  moveStartTime = performance.now()
  opts.draggingId.value = id
  draggingStartPoint = { x: ev.clientX, y: ev.clientY }
}

function pointermove(ev: PointerEvent) {
  const { clientX, clientY } = ev

  if(!opts.draggingId.value) return

  endX = ev.clientX;
  endY = ev.clientY;
  // Calculate velocity
  velocityX = endX - startX;
  velocityY = endY - startY;
  // Update rotation
  const speed = velocityX / (performance.now() - moveStartTime);
  const rotate = -(speed / maxSpeed) * maxAngle * fixedCoefficient; // TODO：判断位置
  if(moveCounter++ % 10 === 0) {
    opts.draggingPoint.rotate =  Number(rotate.toFixed(2));
    console.log('rotate', rotate)
    moveCounter = 0;
  } else {
    moveCounter++;
  }
  moveStartTime = performance.now();
  startX = endX;
  startY = endY;

  const dx = clientX - draggingStartPoint.x
  const dy = clientY - draggingStartPoint.y
  opts.draggingPoint.x = dx
  opts.draggingPoint.y = dy
}

function pointerup() {
  if(!opts.draggingId.value) return
  opts.draggingPoint.rotate = 0
  opts.draggingId.value = undefined
}

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