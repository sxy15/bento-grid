<template>
  <div 
    ref="bentoGridRef"
    :style="{
      width: bentoGridWidth,
      height: bentoGridHeight
    }"
    :class="['bento-grid', `${prefix}_grid`]">
    <BentoGridItem
      v-for="item in grids" 
      :key="item.id" 
      v-bind="item">
      <item v-bind="item"/>
    </BentoGridItem>

    <div
      v-show="draggingPoint"
      :class="['bento-grid-placeholder', `${prefix}_placeholder`]"
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
  import { ref, computed } from 'vue';
  import { MAX, DEFAULT_PREFIX } from './constants'
  import BentoGridItem from './BentoGridItem.vue';
  import { BentoGridItemProps, cols, type BentoGridProps } from './types'
import { initMatrix } from './helpers/matrix';

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
  const grids = ref<BentoGridItemProps[]>(props.grids)
  const bentoGridRef = ref<HTMLElement | null>(null)
  const isDragging = ref(false)
  const draggingPoint = ref(null)
  const placeholder = ref<BentoGridItemProps>({
    id: 'placeholder',
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    index: -1,
  })
  const bentoGridWidth = computed(() => `${props.max * props.size + (props.max - 1) * props.gutter}px`)
  const bentoGridHeight = computed(() => {
    const h = grids.value.reduce((p, c) => {
      return (p.y + p.h > c.y + c.h) ? p : c
    })
    return `${(h.y + h.h) * props.size! + (h.y + h.h - 1) * props.gutter!}px`
  })

  // 1. 初始化grid位置
  if(grids.value?.length) {
    initMatrix(grids, props)
  }
  // 2. 拖拽绑定处理
</script>

<style lang="scss">
  .bento-grid {
    position: relative;
    will-change: transform;
    transition: all 200ms ease;
    margin-left: auto;
    margin-right: auto;
  }

  .bento-grid-placeholder {
    pointer-events: none;
    transition: all 500ms ease;
    border-radius: 8px;
    background: rgba(0, 0, 0, .1);
    box-sizing: border-box;
    overflow: hidden;
    z-index: 2;
  }
</style>