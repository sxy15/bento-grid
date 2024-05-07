<template>
  <div
    :class="[`${prefix}-item`, 'bento-grid-item']"
    :id="`${prefix}-${props.id}`"
    :style="itemStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { Ref, StyleValue, computed, inject } from 'vue';

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

  const itemStyle: Ref<StyleValue> = computed(() => {
    const [_size, _gutter] = [size.value, gutter.value]
    return {
      position: 'absolute',
      willChange: 'transform',
      transform: `translate3d(${props.x! * (_size + _gutter)}px, ${props.y! * (_size + _gutter)}px, 0)`,
      transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
      width: `${props.w! * _size + (props.w - 1) * _gutter}px`,
      height: `${props.h! * _size + (props.h - 1) * _gutter}px`,
      overflow: 'hidden',
    }
  })
</script>