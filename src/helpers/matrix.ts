import { Ref } from "vue";
import { BentoGridItemProps, BentoGridProps } from "../types";
import { makeArray } from "./utils";

export const initMatrix = (grids: Ref<BentoGridItemProps[]>, props: BentoGridProps) => {
  const isOverlap = checkOverlap(grids.value)
  const isOutBoundary = checkBoundary(grids.value, props.max!)
  if(isOverlap || isOutBoundary) {
    sortDefault(grids, props.max!)
  }
}

// 判断元素是否重叠
export const checkOverlap = (grids: BentoGridItemProps[]): boolean => {
  for(let i = 0; i < grids.length; i++) {
    const cell1 = grids[i]
    for(let j = i + 1; j < grids.length; j++) {
      const cell2 = grids[j]
      const xOverlap = cell1.x + cell1.w > cell2.x && cell1.x < cell2.x + cell2.w
      const yOverlap = cell1.y + cell1.h > cell2.y && cell1.y < cell2.y + cell2.h
      if(xOverlap && yOverlap) {
        return true
      }
    }
  }
  return false
}

// 判断元素是否在边界内
export const checkBoundary = (grids: BentoGridItemProps[], max: number): boolean => {
  const out: BentoGridItemProps[] = []
  grids.forEach((cell) => {
    const maxX = cell.x + cell.w
    const minX = cell.x
    const minY = cell.y
    if(maxX > max || minX < 0 || minY < 0) {
      out.push(cell)
    }
  })
  return out.length > 0
}

// 布局
export const sortDefault = (grids: Ref<BentoGridItemProps[]>, max: number) => {
  const totalHeight = grids.value.reduce((acc, cur) => acc + cur.y + cur.h, 0)
  const matrix: number[][] = makeArray(totalHeight).map(() => makeArray(max))
  // 将grids进行排序，更新index
  const [sorted, map] = setGridsIndex(grids)
  // grids更新了 -> 更新matrix
  for(let index = 0; index < sorted.length; index++) {

    f1: for(let row = 0; row < matrix.length; row++) {
      for(let col = 0; col < matrix[row].length; col++) {
        const w = sorted[index].w
        const h = sorted[index].h

        // 检查当前形状的位置是否可用
        let available = true
        for(let i = row; i < row + h; i++) {
          for(let j = col; j < col + w; j++) {
            if(matrix[i][j] !== 0) {
              available = false
              break
            }
          }
          if(!available) {
            break
          }
        }

        // 如果可用，则更新matrix & grids items 的位置
        if(available) {
          const realIdx = map.get(sorted[index].id)
          if(realIdx !== undefined) {
            grids.value[realIdx].x = col
            grids.value[realIdx].y = row
          }
          for(let i = row; i < row + h; i++) {
            for(let j = col; j < col + w; j++) {
              matrix[i][j] = 1
            }
          }
          break f1
        }
      }
    }
  }
}

export const setGridsIndex = (grids: Ref<BentoGridItemProps[]>): [BentoGridItemProps[], Map<string, number>] => {
  const sorted = sortItemsByRowCol(grids.value)
  const map = new Map(sorted.map((item, index) => [item.id, index]))
  grids.value.forEach(item => {
    const idx = map.get(item.id)
    if(idx !== undefined) {
      item.index = idx
    }
  })

  return [sorted, map]
}

// sorted from top left to right an down
export const sortItemsByRowCol = (items: BentoGridItemProps[]) => {
  return [...items].sort((a, b) => {
    if(a.y === b.y && a.x === b.x) {
      return 0
    }
    if(a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }
    return -1
  })
}