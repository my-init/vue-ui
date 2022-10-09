<template>
<input class="demo-input" :type="type"/>
</template>

<script lang="ts">
export default {
  name: 'DemoInput'
}
</script>

<script lang="ts" setup>
defineProps<{ type:string }>()
</script>

<style lang="less">
  .demo-input {
    border: none;
    border-bottom: 1px solid #ccc;
  }
</style>