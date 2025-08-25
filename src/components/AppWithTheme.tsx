import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useTheme } from '../hooks/useTheme'
import { themeConfigs } from '../config/theme'
import App from '../App'

const AppWithTheme: React.FC = () => {
  const { themeMode } = useTheme()
  const currentTheme = themeConfigs[themeMode]
  
  return (
    <ConfigProvider
      locale={zhCN}
      theme={currentTheme}
    >
      <App />
    </ConfigProvider>
  )
}

export default AppWithTheme