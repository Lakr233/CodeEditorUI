import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Checker from 'vite-plugin-checker'
import WindiCSS from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'
export default ({ mode }) => {
  const isDev = mode === 'development'

  return defineConfig({
    plugins: [
      // vueJsx(),
      WindiCSS(),
      vue({}),
      tsconfigPaths(),

      Checker({
        typescript: true,
        enableBuild: true,
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue\??/, // .vue
        ],
        dts: true,
        imports: ['vue'],
      }),
    ],

    define: {
      __DEV__: isDev,
    },
    base: './',

    esbuild: {
      jsxFactory: 'h',
      jsxInject: 'import {h,Fragment} from "vue"',
      jsxFragment: 'Fragment',
    },
  })
}
