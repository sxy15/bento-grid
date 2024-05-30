import { Ref, watch } from "vue";
import { BentoGridItemProps, BentoGridItemType, BentoGridProps } from "../types";
import { assign } from "./utils";
import { ROTATE_CONFIG } from "../constants";

let pointStart = {x: 0, y: 0}
let pointTo = {x: 0, y: 0}
let moveStartTime = performance.now()
let pointInTop = false

export const initDrag = (
  ref: Ref<HTMLElement | null>,
  grids: Ref<BentoGridItemProps[]>,
  isDragging: Ref<boolean>,
  placeholder: Ref<BentoGridItemProps>,
  draggingPoint: Ref<any>,
  props: BentoGridProps
) => {

  watch(isDragging, (nv) => {
    if(nv) {
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.cursor = 'unset'
    }
  })

  watch(() => props.draggable, (nv) => {
    if(nv) {
      bindPointerEvent()
    } else {
      unbindPointerEvent()
    }
  }, { immediate: true })

  // 限制图片拖拽默认行为
  ref.value!.addEventListener('pointerdown', (e) => {
    e.preventDefault()
  }, false)

  function bindPointerEvent() {
    window.addEventListener('pointerdown', pointerdown, false)
    window.addEventListener('pointermove', pointermove, false)
    window.addEventListener('pointerup', pointerup, false)
  }

  function unbindPointerEvent() {
    window.removeEventListener('pointerdown', pointerdown, false)
    window.removeEventListener('pointermove', pointermove, false)
    window.removeEventListener('pointerup', pointerup, false)
  }

  function pointerdown(e: PointerEvent) {
    pointStart = {x: e.clientX, y: e.clientY}
    const grid =  getGridByPoint(pointStart)
    draggingPoint.value = grid
    if(draggingPoint.value) {
      isDragging.value = true
      placeholder.value = assign({}, draggingPoint.value)
      pointInTop = e.clientY < (grid.y + grid.h / 2) * props.size! 
    }
  }

  function pointermove(e: PointerEvent) {
    const rect = ref.value!.getBoundingClientRect()
    if(!rect || !draggingPoint.value) {
      return
    }
    pointTo = {x: e.clientX, y: e.clientY}
    const velocity = calVelocity(pointStart.x, e.clientX, moveStartTime)
    const { maxRotation, maxVelocity, rotationFactor } = ROTATE_CONFIG
    const rotate = velocity / maxVelocity * maxRotation * rotationFactor
    draggingPoint.value.rotate = Number(rotate.toFixed(2))
    moveStartTime = performance.now()

    // 拖拽时的偏移量
    const offsetX = (pointTo.x - pointStart.x) / props.size!
    const offsetY = (pointTo.y - pointStart.y) / props.size!

    if(isDragging.value) {
      draggingPoint.value.x += offsetX
      draggingPoint.value.y += offsetY
      pointStart = {x: pointTo.x, y: pointTo.y}
      // 限制拖拽范围
      if(draggingPoint.value.x < 0) {
        draggingPoint.value.x = 0
      }
      if(draggingPoint.value.y < 0) {
        draggingPoint.value.y = 0
      }
      if(draggingPoint.value.x + draggingPoint.value.w > props.max!) {
        draggingPoint.value.x = props.max! - draggingPoint.value.w
      }

      placeholder.value.x = Math.round(draggingPoint.value.x)
      placeholder.value.y = Math.round(draggingPoint.value.y)

      // 拖拽时的排序
    }
  }

  function pointerup(e: PointerEvent) {
    if(draggingPoint.value) {
      draggingPoint.value.x = placeholder.value.x
      draggingPoint.value.y = placeholder.value.y
      draggingPoint.value = null
    }
    pointStart.x = 0
    pointStart.y = 0
    // 拖拽完成排序
    
    isDragging.value = false
  }

  function getGridByPoint(point: {x: number, y: number}): BentoGridItemProps {
    let grid: any = null
    let ele = document.elementFromPoint(point.x, point.y)
    // 查到指定的id
    while(ele && !ele.classList.contains(`${props.prefix}_grid_item`)) {
      ele = ele.parentElement
    }

    if(ele !== null) {
      grid = grids.value.find(it => `${props.prefix}-${it.id}`  === ele.getAttribute('data-id'))
    }
    
    return grid
  }

  function calVelocity(startX: number, endX: number, startTime: number): number {
    const duration = performance.now() - startTime
    const distance = endX - startX
    return distance / duration
  }
}