<script setup>
import Cell from './components/Cell.vue'
import img1 from './assets/1.jpeg'
import img2 from './assets/2.jpeg'
import img3 from './assets/3.jpeg'
import img4 from './assets/4.jpeg'
import img5 from './assets/5.jpeg'
import img6 from './assets/6.jpeg'
import { BentoGrid } from '../src/index'
import { ref } from 'vue'

const grids = ref([
  { id: '1', x: 2, y: 0, w: 2, h: 2, index: 1, externalProps: { img: img1 } },
  { id: '2', x: 0, y: 0, w: 2, h: 1, index: 0, externalProps: { img: img2 } },
  { id: '3', x: 0, y: 0, w: 1, h: 1, index: 2, externalProps: { img: img3 } },
  { id: '4', x: 0, y: 0, w: 1, h: 2, index: 3, externalProps: { img: img4 } },
  { id: '5', x: 0, y: 0, w: 2, h: 1, index: 4, externalProps: { img: img5 } },
  { id: '6', x: 0, y: 0, w: 1, h: 1, index: 5, externalProps: { img: img6 }},
])

const max = ref(6)

const resize = () => {
  const width = window.innerWidth
  if (width < 768) {
    max.value = 3
  } else if (width < 1024) {
    max.value = 4
  } else {
    max.value = 6
  }
}

window.addEventListener('resize', resize)
resize()
</script>

<template>
  <BentoGrid 
    :grids="grids" 
    :item="Cell"
    :max="max"
    :size="100"
    >
  </BentoGrid>
</template>

<style scoped>
  .bento-grid {
    width: 624px;
    background-color: aliceblue;
  }
</style>
