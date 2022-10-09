
import DefaultTheme from 'vitepress/theme'
import DemoBlock from '../components/DemoBlock.vue'
import VueUI from '../../../src'

export default {
  ...DefaultTheme,

  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.
    app.component('Demo', DemoBlock)
    app.use(VueUI)
  },

  setup() {
    // this function will be executed inside VitePressApp's
    // setup hook. all composition APIs are available here.
  }
}