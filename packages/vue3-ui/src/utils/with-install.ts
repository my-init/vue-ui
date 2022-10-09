import type { App, Component } from 'vue'

export type WithInstall<T> = T & {
  install(app: App): void
}

export function withInstall<T extends Component>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options as { name: string }
    app.component(name, options)
  }

  return options as WithInstall<T>
}
