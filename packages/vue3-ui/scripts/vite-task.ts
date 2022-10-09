import { build, defineConfig, UserConfig } from 'vite'
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { cpSync } from "node:fs";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

const ROOT_DIR = process.cwd()

const getConfig = (inFile:string, name:string) => {
  return {
    plugins: [vue(), vueJsx()],
    build: {
      outDir: `dist/${name}`,
      lib: {
        entry: inFile,
        formats: ['es'],
        // the proper extensions will be added
        fileName: 'index',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue"]
      }
    },
  } as UserConfig
}

(['input/index.vue', 'button/index.tsx']).forEach( file => {
  const cmpName = file.split('/')[0]
  build(getConfig(resolve(ROOT_DIR, `src/${file}`), cmpName))
})

