import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import tsconfigPaths from 'vite-tsconfig-paths'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'
import prefetchChunk from 'vite-plugin-prefetch-chunk'
import { fileURLToPath, URL } from 'node:url'
import { version } from './package.json'

// https://vite.dev/config/
export default ({ mode }: { mode: any }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('🚀 ~ env:', env)
  console.log('当前版本', version, env.MODE)

  return defineConfig({
    base: env.VITE_BASE,
    define: {
      __APP_VERSION__: JSON.stringify(`-v${version}`)
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {},
        less: {}
      }
    },
    plugins: [
      vue(),
      eslintPlugin({
        // 这里配置项的含义和 .eslintrc 中的配置项是一样的
        failOnWarning: true,
        include: [
          'src/**/*.ts',
          'src/**/*.tsx',
          'src/**/*.vue',
          'src/*.ts',
          'src/*.tsx',
          'src/*.vue'
        ],
        exclude: ['node_modules', 'dist']
      }),
      tsconfigPaths({ loose: true }),
      VueSetupExtend(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_TITLE
          }
        }
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
            resolveIcons: true
          })
        ]
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        // eslint 报错解决：'ref' is not defined
        eslintrc: {
          // 默认 false, true 启用生成。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把 enable 关掉，即改成 false。
          // 否则这个文件每次会在重新加载的时候重新生成，这会导致 eslint 有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
          enabled: true
          // filepath: './.eslintrc-auto-import.json', // 默认就是 ./.eslintrc-auto-import.json
          // globalsPropValue: true, // 默认 true
        },
        resolvers: [AntDesignVueResolver()],
        dts: './types/auto-imports.d.ts'
      }),
      createSvgIconsPlugin({
        // 指定路径在你的src里的svg存放文件
        iconDirs: [
          fileURLToPath(new URL('./src/assets/icons', import.meta.url))
        ],
        // 指定symbolId格式
        symbolId: '[name]'
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024,
        algorithm: 'gzip',
        deleteOriginFile: true
      }),
      //预加载插件
      prefetchChunk({
        prefetchLegacyChunks: true
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: false,
      hmr: { overlay: false },
      proxy: {
        [`^${env.VITE_API}`]: {
          target: env.VITE_TARGET,
          changeOrigin: true,
          // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
          rewrite: (path: string) =>
            path.replace(RegExp(`^${env.VITE_API}`), '')
        }
      }
    },
    build: {
      outDir: 'dist' + env.VITE_BASE,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        maxWorkers: 1
      },
      rollupOptions: {
        output: {
          // 自定义代码分割中产生的 chunk 的文件名
          chunkFileNames: 'js/[name]-[hash].js',
          //指定入口文件的文件名模式
          entryFileNames: 'js/[name]-[hash].js',
          //自定义构建结果中的静态资源名称
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 将所有来自 node_modules 的模块单独打包到一个文件中
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          }
        },
        //用于指定打包时应该将哪些模块作为外部模块处理
        //external: ['axios'], // 指定 axios 为外部模块
        // 指定要使用的 Rollup 插件
        plugins: [
          // 在这里添加 Rollup 插件
        ]
      }
    }
  })
}
