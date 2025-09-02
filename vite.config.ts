import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactResponsivePlugin from './plugins/vite-plugin-react-responsive'
import { autoI18nPlugin } from './plugins/vite-plugin-auto-i18n'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactResponsivePlugin({
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
      },
      defaultBreakpoint: 'lg',
      include: /\/components\/.*\/index\.(tsx?|jsx?)$/,
    }),
    autoI18nPlugin({
      localesDir: 'src/locales',
      defaultLocale: 'zh-CN',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts']
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // 分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
  server: {
    // 自动打开浏览器
    open: true,
  },
  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
