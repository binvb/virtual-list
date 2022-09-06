// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
        outDir: './dist'
    })
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, './../src/main.ts'),
      name: 'vue3-virtual-list',
      // the proper extensions will be added
      fileName: 'vue3-virtual-list',
      formats: ['es']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {}
    }
  }
})
