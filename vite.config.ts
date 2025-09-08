import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// import reactResponsivePlugin from './plugins/vite-plugin-react-responsive'
import { autoI18nPlugin } from './plugins/vite-plugin-auto-i18n'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // reactResponsivePlugin({
    //   breakpoints: {
    //     sm: 576,
    //     md: 768,
    //     lg: 992,
    //     xl: 1200,
    //     xxl: 1400,
    //   },
    //   defaultBreakpoint: 'lg',
    //   include: /\/components\/.*\/index\.(tsx?|jsx?)$/,
    // }),
    autoI18nPlugin({
      localesDir: 'src/locales',
      defaultLocale: 'zh-CN',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts']
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Vite 7.x 构建优化
    target: 'esnext', // 使用最新的 ECMAScript 特性,不考虑兼容性
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'development',
    
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    
    // 构建性能优化
    reportCompressedSize: false,
    
    // Terser 优化选项
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      format: {
        comments: false,
      },
    },
    
    // 分包策略
    rollupOptions: {
      output: {
        // 更精确的代码分割策略
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom'],
          // Ant Design 组件库
          'antd-core': ['antd'],
          // Ant Design 图标
          'antd-icons': ['@ant-design/icons'],
          // 国际化相关
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
        },
        // 文件命名策略 - Vite 7.x 优化
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '') || 'chunk'
            : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          return `assets/[ext]/[name]-[hash].[ext]`;
        },
      },
    },
    
    // 其他构建优化
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  server: {
    // 自动打开浏览器
    open: true,
    // Vite 7.x 服务器优化
    host: true,
    // port: 3000,
    strictPort: false,
    // HMR 优化
    hmr: {
      overlay: true,
    },
    // 预构建优化
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx'],
    },
  },
  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Less 优化选项
        modifyVars: {
          // 可以在这里定义全局 Less 变量
        },
      },
    },
    // CSS 模块化配置
    modules: {
      localsConvention: 'camelCase',
    },
    // PostCSS 优化
    postcss: {
      plugins: [
        // 可以添加 PostCSS 插件
      ],
    },
  },
  
  // Vite 7.x 优化选项
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      '@ant-design/icons',
      'i18next',
      'react-i18next',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // 实验性功能
  experimental: {
    // 启用构建优化
    renderBuiltUrl: (filename) => {
      return `/${filename}`;
    },
  },
})
