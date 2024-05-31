import { Ref, watch } from "vue";
import { BentoGridItemProps, BentoGridItemType, BentoGridProps } from "../types";
import { assign } from "./utils";
import { ROTATE_CONFIG } from "../constants";

let pointStart = {x: 0, y: 0}
let pointTo = {x: 0, y: 0}
let moveStartTime = performance.now()
let pointInTop = false
let area: string[][] = []

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

      // 收集拖拽项以外的格子
      const excludeDraggingGrids: BentoGridItemProps[] = []
      grids.value.forEach(grid => {
        if(grid.id !== draggingPoint.value.id) {
          excludeDraggingGrids.push(grid)
        }
      })

      area = getArea(excludeDraggingGrids)

      const lineCount = area.length

      arrangeByLine(lineCount, excludeDraggingGrids)

      const y = bubbleUp(placeholder.value, area)
      if(y < placeholder.value.y) {
        placeholder.value.y = y
      }

      const allGridsByAreaSort = getAllCellsByArea(area, excludeDraggingGrids)
      hitAllEle(placeholder.value, allGridsByAreaSort)
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

  function getArea(nodes: BentoGridItemProps[]) {
    const area: any = []
    nodes.forEach(n => {
      for(let row = n.y; row < n.y + n.h; row++) {
        area[row] = area[row] || []
        for(let col = n.x; col < n.x + n.w; col++) {
          area[row][col] = n.id
        }
      }
    })
    return area
  }

  function arrangeByLine(lineCount: number, excludeDraggingGrids: BentoGridItemProps[]) {
    for(let row = 0; row < lineCount; row++) {
      if(area[row] && area[row]?.length > 0) {
        area[row].forEach(id => {
          if(id) {
            excludeDraggingGrids.forEach(g => {
              if(g.id === id) {
                const y = bubbleUp(g, area)
                if(y < g.y) {
                  g.y = y
                }
              }
            })
          }
        })
      }
      area = getArea(excludeDraggingGrids)
    }
  }

  // 向上冒泡
  function bubbleUp(node: BentoGridItemProps, area: string[][]): number {
    for(let row = node.y - 1; row >= 0; row--) {
      if(area[row] === undefined) {
        continue
      }

      for(let col = node.x; col < node.x + node.w; col++) {
        if (
          area[row]
          && area[row + 1]
          && area[row][col] !== undefined
          && area[row + 1][col] !== undefined
          && area[row][col] === area[row + 1][col]
        ) {
          // 这里是两行的情况
          //  ██ || ██ ██
          //  ██ || ██ ██
        } else if(area[row][col] !== undefined) {
          return row + 1
        }
      }
    }
    return 0
  }

  function getAllCellsByArea(area: string[][], allGrids: BentoGridItemProps[]) {
    const result: BentoGridItemProps[] = []
    Array.from(new Set(area.flat())).forEach(id => {
      allGrids.forEach(g => {
        if(g.id === id && result.findIndex(it => it.id === g.id) === -1) {
          result.push(g)
        }
      })
    })
    return result
  }

  function hitAllEle(node: BentoGridItemProps, allNodes: BentoGridItemProps[]) {
    const hitNodes: any = []
    allNodes.forEach((n) => {
      if(node.id !== n.id && checkHit(node, n)) {
        hitNodes.push(n)
      }
    })
    hitNodes.forEach((n: BentoGridItemProps) => {
      for (let h = n.y + 1; h <= node.y + node.h; h++) {
        n.y = h
        // 每次移动一格之后，就来检测一下，是否还有元素被碰撞
        hitAllEle(n, allNodes)
      }
    })
  }

  function checkHit(a: BentoGridItemProps, b: BentoGridItemProps) {
    return (
      a.x < b.x + b.w
      && a.x + a.w > b.x
      && a.y < b.y + b.h
      && a.y + a.h > b.y
    )
  }
}