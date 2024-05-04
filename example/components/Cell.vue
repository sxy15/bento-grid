<script setup lang="ts">
  defineProps({
    externalProps: Object,
  })
</script>

<template>
  <div class="cell">
    <img :src="externalProps?.img" alt="">
  </div>
</template>

<style scoped>
  .cell {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
    padding: 4px;
    box-sizing: border-box;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
</style>
