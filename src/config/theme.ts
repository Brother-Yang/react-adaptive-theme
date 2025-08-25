import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

// 导出Ant Design主题算法
export const { defaultAlgorithm, darkAlgorithm } = theme

// 亮色主题配置
export const lightTheme: ThemeConfig = {
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
}

// 暗色主题配置
export const darkTheme: ThemeConfig = {
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