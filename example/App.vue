<script setup>
import Cell from './components/Cell.vue'
import img1 from './assets/1.jpeg'
import img2 from './assets/2.jpeg'
import img3 from './assets/3.jpeg'
import img4 from './assets/4.jpeg'
import img5 from './assets/5.jpeg'
import img6 from './assets/6.jpeg'
import { BentoGrid } from '../src/index'

const grids = [
  { id: '1', x: 0, y: 0, w: 2, h: 2, index: 0, externalProps: { img: img1 } },
  { id: '2', x: 0, y: 0, w: 2, h: 1, index: 1, externalProps: { img: img2 } },
  { id: '3', x: 0, y: 0, w: 1, h: 1, index: 2, externalProps: { img: img3 } },
  { id: '4', x: 0, y: 0, w: 1, h: 2, index: 3, externalProps: { img: img4 } },
  { id: '5', x: 0, y: 0, w: 2, h: 1, index: 4, externalProps: { img: img5 } },
  { id: '6', x: 0, y: 0, w: 1, h: 1, index: 5, externalProps: { img: img6 }},
]
</script>

<template>
  <BentoGrid 
    :grids="grids" 
    :item="Cell"
    :size="size"
    >
  </BentoGrid>
</template>

<style scoped>

</style>
