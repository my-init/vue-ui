<template>
<ClientOnly>
  <div class="demo-block">
    <header class="demo-block__header">
      <slot name="title">
        <component :is="titleTag" class="demo-header__title" v-if="title">{{
          title
        }}</component>
        <span class="demo-block__toolbar">
          <i
            v-for="tool in tools"
            :key="tool"
            v-html="iconMap[tool]"
            @click="onOperate(tool)"
          ></i>
        </span>
      </slot>
    </header>
    <section class="demo-block__desc" v-if="desc || $slots.desc">
      <slot name="desc" ><div v-html="desc"></div></slot>
    </section>
    <main class="demo-block__preview">
      <slot></slot>
    </main>
    <footer class="demo-block__code" v-if="showCode">
      <slot name="code"><div :class="`language-${lang} `" v-html="decodeURIComponent(highlightedCode)"></div></slot>
    </footer>
  </div>
</ClientOnly>
</template>
<script lang="ts">
enum ToolType {
  Copy = "copy",
  Code = "code",
  Edit = "edit",
}

enum DemoType {
    Antd = 'antd',
    Element = 'element',
    Detault = 'default'
}
</script>

<script lang="ts" setup>
import { useSlots, ref } from "vue";
const iconMap = {
  copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"/></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"/></svg>',
};
withDefaults(
  defineProps<{
    type?: DemoType;
    title?: string;
    titleTag?: string;
    desc?: string;
    tools?: ToolType[];
    iframe?: boolean;
    code?: string
    lang?: string
    highlightedCode?: string
    src?: string
  }>(),
  {
    title: "",
    titleTag: "h4",
    desc: "",
    tools: [ToolType.Copy, ToolType.Code],
    iframe: false,
    lang: 'vue'
  }
);

const onOperate = (action: ToolType) => {
    if(action === ToolType.Code) {
        showCode.value = !showCode.value
    }
};

const slots = useSlots();
const showCode = ref(false);

</script>

<style lang="less">
.demo-block {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
  &__header {
    display: flex;
    margin-left: auto;
    justify-content: space-between;
  }
  .demo-header {
    &__title {
      margin: 0;
      margin-bottom: 10px;
    }
  }
  &__desc {
    color: #666;
    font-size: 13px;
    margin-bottom: 10px;
    p {
      margin: 0 0 20px 0;
    }
  }
  &__toolbar {
    display: flex;
    align-items: center;
    margin-left: auto;
    i {
      margin-left: 10px;
      color: #666;
      cursor: pointer;
      &:hover {
        color: var(--vp-c-brand);
      }
    }
  }
}
</style>
