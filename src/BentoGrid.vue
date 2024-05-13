<template>
  <div 
    :class="['bento-grid', `${prefix}-grid`]" ref="bentoGridRef">
    <BentoGridItem
      v-for="item in grids" 
      :key="item.id" 
      v-bind="item">
      <item v-bind="item"/>
    </BentoGridItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, provide, computed, onMounted, reactive } from 'vue';
  import { initMatrix } from './lib'
  import { initBind } from './mount'
  import { MAX, DEFAULT_PREFIX } from './constants'
  import BentoGridItem from './BentoGridItem.vue';
  import type { BentoGridProps, RequiredBentoGridItemProps } from './types'

  defineOptions({
    name: 'BentoGrid',
  })
  const props = withDefaults(defineProps<BentoGridProps>(), {
    max: MAX,
    size: 100,
    gutter: 4,
    disabled: false,
    tilt: true,
    prefix: DEFAULT_PREFIX,
  })
  const bentoGridRef = ref<HTMLElement | null>(null)
  const isDragging = ref(false)
  const draggingId = ref<string>('')
  const draggingPoint = reactive({ x: 0, y: 0, rotate: 0 })
  const placeholder = reactive({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    index: -1,
  })
  const grids = ref<RequiredBentoGridItemProps[]>(props.grids.map((grid, index) => ({
    ...grid,
    x: grid.x ?? 0,
    y: grid.y ?? 0,
    w: grid.w ?? 1,
    h: grid.h ?? 1,
    index,
  })))

  provide('size', computed(() => props.size))
  provide('gutter', computed(() => props.gutter))
  provide('prefix', computed(() => props.prefix))
  provide('draggingId', computed(() => draggingId))
  provide('draggingPoint', computed(() => draggingPoint))

  initMatrix(grids, props)
  
  onMounted(() => {
    initBind(bentoGridRef, {
      grids,
      isDragging,
      draggingId,
      draggingPoint,
      props
    })
  })
</script>

<style lang="scss">
  .bento-grid {
    position: relative;
    will-change: height;
    transition: height 200ms ease;
  }
</style>./bind