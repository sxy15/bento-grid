import { Ref } from "vue";
import { BentoGridItemProps, BentoGridProps } from "../types";

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
}