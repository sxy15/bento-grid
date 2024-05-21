<template>
  <div
    :class="[`${prefix}-item`, 'bento-grid-item', isDragItem && 'bento-grid-item__dragging']"
    :data-id="`${prefix}-${id}`"
    :style="{
      position: 'absolute',
      willChange: 'transform',
      transform: isDragItem
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
        transform: `rotate(${isDragItem ? draggingPoint.rotate : 0}deg)`,
      }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Ref, computed, inject, watch } from 'vue';

  defineOptions({
    name: 'BentoGridItem',
  })
  
  const props = withDefaults(defineProps<{
    id: string,
    x: number,
    y: number,
    w?: number,
    h?: number,
  }>(), {
    w: 1,
    h: 1,
  })

  const size = inject<Ref<number>>('size')!
  const gutter = inject<Ref<number>>('gutter')!
  const prefix = inject<Ref<string>>('prefix')
  const draggingPoint = inject<Ref<any>>('draggingPoint')!
  const isDragItem = computed(() => draggingPoint.value?.id === props.id)

  watch(draggingPoint, (v) => {
    

  }, { deep: true })
</script>

<style lang="scss">
  .bento-grid-item__dragging {
    z-index: 10;
  }
</style>