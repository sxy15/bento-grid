import { BentoGridItemProps } from "../types"

export const makeArray = (length: number) => Array.from({ length }, () => 0)

export const compact = () => {
  
}

export const sortGridsByRowCol = (grids: BentoGridItemProps[]): BentoGridItemProps[] => {
  let _grids = [...grids]
  return _grids.sort((a, b) => {
    if(a.y === b.y && a.x === b.x) {
      return 0
    }
    if(a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }
    return -1
  })
}