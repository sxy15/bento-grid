<template>
  <div
    :class="[`${prefix}-item`, 'bento-grid-item']"
    :id="`${prefix}-${id}`"
    :style="{
      position: 'absolute',
      willChange: 'transform',
      transform: id == draggingId.value
      ? `translate3d(${x! * (size + gutter) + draggingPoint.x}px, ${y! * (size + gutter) + draggingPoint.y}px, 0)` 
      : `translate3d(${x! * (size + gutter)}px, ${y! * (size + gutter)}px, 0)`,
      width: `${w! * size + (w - 1) * gutter}px`,
      height: `${h! * size + (h - 1) * gutter}px`,
    }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { Ref, inject } from 'vue';

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
  const draggingId = inject<Ref<string>>('draggingId')
  const draggingPoint = inject<{ x: number, y: number }>('draggingPoint')
</script>