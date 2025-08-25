import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

// 导出Ant Design主题算法
export const { defaultAlgorithm, darkAlgorithm } = theme

// 扩展主题配置类型，添加base属性
export interface ExtendedThemeConfig extends ThemeConfig {
  base?: {
    colorPrimary?: string
    colorSuccess?: string
    colorWarning?: string
    colorError?: string
    colorText?: string
    colorTextSecondary?: string
    borderColorBase?: string
    backgroundColorBase?: string
    componentBackground?: string
    tableHeaderBg?: string
  }
}

// 亮色主题配置
export const lightTheme: ExtendedThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    wireframe: false,
    // 背景色
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    // 文字色
    colorText: '#000000d9',
    colorTextSecondary: '#00000073',
    colorTextTertiary: '#00000040',
    // 边框色
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
  },
  base: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    borderColorBase: '#d9d9d9',
    backgroundColorBase: '#f0f2f5',
    componentBackground: '#ffffff',
    tableHeaderBg: '#fafafa',
  },
}

// 暗色主题配置
export const darkTheme: ExtendedThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    wireframe: false,
    // 背景色
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    // 文字色
    colorText: '#ffffffd9',
    colorTextSecondary: '#ffffff73',
    colorTextTertiary: '#ffffff40',
    // 边框色
    colorBorder: '#424242',
    colorBorderSecondary: '#303030',
  },
  base: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    borderColorBase: '#434343',
    backgroundColorBase: '#141414',
    componentBackground: '#1f1f1f',
    tableHeaderBg: '#262626',
  },
}

// 应用base属性到CSS变量的函数
export const applyBaseTheme = (theme: ExtendedThemeConfig) => {
  if (!theme.base) return
  
  const root = document.documentElement
  const base = theme.base
  
  // 遍历base对象的所有属性并设置对应的CSS变量
  Object.entries(base).forEach(([key, value]) => {
    if (value) {
      const cssVarName = `--base-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVarName, value)
    }
  })
}

// 主题配置映射
export const themeConfigs = {
  light: lightTheme,
  dark: darkTheme,
} as const

// 本地存储键名
export const THEME_STORAGE_KEY = 'theme-mode'

// 主题类型
export type ThemeMode = keyof typeof themeConfigs