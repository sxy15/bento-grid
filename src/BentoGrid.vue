<template>
  <div class="bento-grid">
    <BentoGridItem 
      v-for="item in grids" 
      :key="item.id" 
      v-bind="item">
      <item v-bind="item"/>
    </BentoGridItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, provide, computed } from 'vue';
  import { init } from './lib'
  import { MAX, DEFAULT_CLASS } from './constants'
  import BentoGridItem from './BentoGridItem.vue';
  import type { BentoGridProps, RequiredBentoGridItemProps } from './types'

  const props = withDefaults(defineProps<BentoGridProps>(), {
    max: MAX,
    size: 100,
    gutter: 4,
    disabled: false,
    tilt: true,
    class: DEFAULT_CLASS,
  })

  provide('size', computed(() => props.size))
  provide('gutter', computed(() => props.gutter))
  provide('class', computed(() => props.class))

  const grids = ref<RequiredBentoGridItemProps[]>(props.grids.map((grid, index) => ({
    ...grid,
    x: grid.x ?? 0,
    y: grid.y ?? 0,
    w: grid.w ?? 1,
    h: grid.h ?? 1,
    index,
  })))

  init(grids, props)
  
</script>