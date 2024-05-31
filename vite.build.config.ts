import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bentoGrids',
      fileName: 'bento-grids'
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: [
        {
          format: 'umd',
          name: 'bento-grids.umd.js',
          entryFileNames: `bento-grids.umd.js`,
        },
        {
          format: 'es',
          entryFileNames: `bento-grids.es.js`,
          preserveModules: false,
        },
      ]
    }
  }
})
