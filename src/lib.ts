import { makeArray } from "./utils";
import type { Ref } from "vue";
import type { BentoGridProps, RequiredBentoGridItemProps } from "./types";

export function initMatrix(grids: Ref<RequiredBentoGridItemProps[]>, props: BentoGridProps) {
  if(grids.value.length === 0) return
  const isOverlap = checkOverlap(grids.value);
  const isOutBoundary = checkOutBoundary(grids.value, props);

  if(isOverlap || isOutBoundary) {
    initializeGrids(grids, props)
  }
}

// Check if the grids overlap
function checkOverlap(grids: RequiredBentoGridItemProps[]): boolean {
  for (let i = 0; i < grids.length; i++) {
    for (let j = i + 1; j < grids.length; j++) {
      const grid1 = grids[i];
      const grid2 = grids[j];
      const xOverlap = grid1.x < grid2.x + grid2.w && grid1.x + grid1.w > grid2.x;
      const yOverlap = grid1.y < grid2.y + grid2.h && grid1.y + grid1.h > grid2.y;
      if (xOverlap && yOverlap) {
        return true;
      }
    }
  }
  return false;
}

// Check if the grids are without the boundary
function checkOutBoundary(grids: RequiredBentoGridItemProps[], props: Pick<BentoGridProps, 'max'>) {
  const { max } = props;

  return grids.some(grid => 
    grid.x < 0 ||
    grid.y < 0 ||
    grid.x + grid.w > max)
}

function initializeGrids(grids: Ref<RequiredBentoGridItemProps[]>, props: Pick<BentoGridProps, 'max'>) {
  const { max } = props;
  const maxGrid = grids.value.reduce((sum, item) => sum + item.y + item.h, 0);
  const matrix =  makeArray(maxGrid).map(() => makeArray(max));

  const middle = sortGrids(grids)

  updateMatrix(matrix, grids, middle);

  console.log('matrix', matrix)
}

function sortGrids(grids: Ref<RequiredBentoGridItemProps[]>): [RequiredBentoGridItemProps[], Map<string, number>]{
  const temp = grids.value.map(grid => grid);
  temp.sort((a, b) => a.x - b.x || a.y - b.y);

  const id2idxMap: Map<string, number> = new Map(temp.map((grid, index) => [grid.id, index]));
  grids.value.forEach(grid => {
    const idx = id2idxMap.get(grid.id)!;
    grid.index = idx;
  })

  return [temp, id2idxMap];
}

function updateMatrix(matrix: number[][], 
  grids: Ref<RequiredBentoGridItemProps[]>, 
  middle: [RequiredBentoGridItemProps[], Map<string, number>]) {
  const [temp, tempMap] = middle;

  for(let i = 0; i < temp.length; i++) {
    let foundCell = false;

    for(let row = 0; row < matrix.length; row++) {
      if (foundCell) break
      for(let col = 0; col < matrix[row].length; col++) {
        const {w, h} = temp[i];
        
        let available = true
        for (let r = row; r < row + h; r++) {
          for (let c = col; c < col + w; c++) {
            if (matrix[r][c] !== 0) {
              available = false
              break
            }
          }
          if (!available)
            break
        }

        if (available) {
          const realIndex = tempMap.get(temp[i].id)
          if (realIndex !== undefined) {
           grids.value[realIndex].x = col
           grids.value[realIndex].y = row
          }
          for (let r = row; r < row + h; r++) {
            for (let c = col; c < col + w; c++)
              matrix[r][c] = 1
          }
          foundCell = true
          break
        }
      }
    }
  }
}