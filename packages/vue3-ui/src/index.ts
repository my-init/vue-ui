export { default as Input } from './input/index.vue'
import type { App } from 'vue'
import { Button } from './button'
import Input from './input/index.vue' 
import { withInstall } from './utils/with-install'

export * from './button'

const VueUI = {
  Input,
  Button,
  
}

export default {
  ...VueUI,
  install: (app:App) => {
    
    Object.keys(VueUI).forEach(name  => {
      const Cmp = VueUI[name as keyof typeof VueUI]
      app.component(Cmp.name, Cmp)
    })
    
  }
}