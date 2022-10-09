# DemoButton

## 示例

<Demo title="类型" desc="<code>type</code> 来设置不同的信息等级。">
  <DemoButton>按钮</DemoButton>
  <DemoButton type="primary">按钮</DemoButton>
  <DemoButton type="success">按钮</DemoButton>
  <DemoButton type="warning">按钮</DemoButton>
  <DemoButton type="danger">按钮</DemoButton>
</Demo>

<Demo title="大小" src="./demo-button.vue">
  <template #desc>使用 <code>size</code> 来设置按钮尺寸。</template>
</Demo>

## 示例（冗余）

> 以下为通过 markdown container 来书写的示例。

::: demo 类型

`type` 来设置不同的信息等级。

```vue
<DemoButton>按钮</DemoButton>
<DemoButton type="primary">按钮</DemoButton>
<DemoButton type="success">按钮</DemoButton>
<DemoButton type="warning">按钮</DemoButton>
<DemoButton type="danger">按钮</DemoButton>
```

:::


::: demo 标题 src="./demo-button.vue"

使用 `size` 来设置按钮尺寸。

:::


::: demo the Demo Title
Some markdown text render as **`desc`**.

写了些脚本在其中。

```vue
<template>
  <DemoButton @click="onClick" type="success">Click: {{counter}}</DemoButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0)
const onClick = () => counter.value++
</script>
```
:::

