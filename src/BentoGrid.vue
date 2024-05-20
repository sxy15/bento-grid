<template>
  <div 
    ref="bentoGridRef"
    :style="{
      position: 'relative',
      height: bentoGridHeight
    }"
    :class="['bento-grid', `${prefix}-grid`]">
    <BentoGridItem
      v-for="item in grids" 
      :key="item.id" 
      v-bind="item">
      <item v-bind="item"/>
    </BentoGridItem>

    <div
      v-show="draggingId"
      :class="['bento-item-placeholder', `${prefix}-grid`]"
      :style="{
        position: 'absolute',
        willChange: 'transform',
        transform: `translate3d(
          ${placeholder.x * (props.size + props.gutter)}px, 
          ${placeholder.y * (props.size + props.gutter)}px,
        0)`,
        width: `${placeholder.w * props.size + (placeholder.w - 1) * props.gutter}px`,
        height: `${placeholder.h * props.size + (placeholder.h - 1) * props.gutter}px`,
      }">
      <slot name="placeholder"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, provide, computed, onMounted, reactive, watch } from 'vue';
  import { initMatrix, initMount } from './init'
  import { MAX, DEFAULT_PREFIX } from './constants'
  import BentoGridItem from './BentoGridItem.vue';
  import { BentoGridItemProps, cols, type BentoGridProps, type RequiredBentoGridItemProps } from './types'

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
    cols: () => cols
  })

  const bentoGridRef = ref<HTMLElement | null>(null)
  const bentoGridHeight = ref('0px')
  const isDragging = ref(false)
  const draggingId = ref<string>('')
  const draggingPoint = reactive({ x: 0, y: 0, rotate: 0 })
  const placeholder = ref<BentoGridItemProps>({
    id: 'placeholder',
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    index: -1,
  })
  const grids = ref<RequiredBentoGridItemProps[]>(props.grids.map((grid, index) => ({
    ...grid,
    _id: `${props.prefix}-${grid.id}`,
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

  watch(grids, (v) => {
    if(v?.length) {
      const h = v.reduce((acc, cur) => (acc?.y + acc?.h > cur?.y + cur?.h ? acc : cur))
      if(h) {
        bentoGridHeight.value = `${(h.y + h.h) * props.size! + (h.y + h.h - 1) * props.gutter!}px`
      }
    }
  }, {
    deep: true,
    immediate: true
  })

  initMatrix(grids, props)
  onMounted(() => {
    initMount(bentoGridRef, {
      grids,
      isDragging,
      draggingId,
      draggingPoint,
      placeholder,
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

  .bento-item-placeholder {
    pointer-events: none;
    transition: all 500ms ease;
    border-radius: 8px;
    background: rgba(0, 0, 0, .1);
    box-sizing: border-box;
    overflow: hidden;
    z-index: 2;
  }
</style>