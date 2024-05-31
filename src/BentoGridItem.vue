<template>
  <div
    :class="[
      `${prefix}_grid_item`, 
      'bento-grid-item',
      (isDragging && isDraggingGrid) && 'bento-grid-item__dragging',
      zIndexClass
    ]"
    :data-id="`${prefix}-${id}`"
    :style="{
      position: 'absolute',
      willChange: 'transform',
      transform: isDraggingGrid
      ? `translate3d(${draggingPoint.x * (size + gutter)}px, ${draggingPoint.y * (size + gutter)}px, 0)` 
      : `translate3d(${x! * (size + gutter)}px, ${y! * (size + gutter)}px, 0)`,
      width: `${w! * size + (w - 1) * gutter}px`,
      height: `${h! * size + (h - 1) * gutter}px`,
    }">
    <div
      :style="{
        width: '100%',
        height: '100%',
        transition: 'transform 200ms ease',
        transform: `rotate(${isDraggingGrid ? draggingPoint.rotate : 0}deg)`,
      }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Ref, computed, inject, ref, watch } from 'vue';
  import { Z_INDEX } from './constants';

  defineOptions({
    name: 'BentoGridItem',
  })
  
  const props = withDefaults(defineProps<{
    id: string,
    x: number,
    y: number,
    w?: number,
    h?: number,
    prefix: string,
    gutter: number,
    size: number,
  }>(), {
    w: 1,
    h: 1,
  })

  const zIndexClass = ref('')
  const draggingPoint = inject<Ref<any>>('draggingPoint')!
  const isDragging = inject<Ref<boolean>>('isDragging')!
  const isDraggingGrid = computed(() => draggingPoint.value?.id === props.id)
  let timer: any = null

  watch(isDraggingGrid, (nv) => {
    if(nv) {
      zIndexClass.value = Z_INDEX
    } else {
      if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
        zIndexClass.value = ''
      }, 400)
    }
  })
</script>

<style lang="scss">
  .bento-grid-item__z {
    z-index: 10;
  }

  .bento-grid-item__dragging {
    transition: none !important;
  }

  .bento-grid-item:hover {
    cursor: grabbing;
  }

  .bento-grid-item {
    transition: all 400ms ease 0s;
  }
</style>