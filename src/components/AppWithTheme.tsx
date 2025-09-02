import React from 'react'
import { ConfigProvider } from 'antd'
import type { Locale } from 'antd/es/locale'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { themeConfigs } from '../config/theme'
import App from '../App'

// 使用对象映射根据当前语言设置选择Antd的locale
const localeMap: Record<string, Locale> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const AppWithTheme: React.FC = () => {
  const { themeMode } = useTheme()
  const { i18n } = useTranslation()
  const currentTheme = themeConfigs[themeMode]
  
  const antdLocale = localeMap[i18n.language] || enUS
  
  return (
    <ConfigProvider
      locale={antdLocale}
      theme={currentTheme}
    >
      <App />
    </ConfigProvider>
  )
}

export default AppWithTheme