import React, { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { THEME_STORAGE_KEY, type ThemeMode, themeConfigs, applyBaseTheme } from '../config/theme'
import { ThemeContext, type ThemeContextType } from './ThemeContextDefinition'

// 主题提供者组件Props
interface ThemeProviderProps {
  children: ReactNode
}

// 获取初始主题
const getInitialTheme = (): ThemeMode => {
  // 优先从localStorage获取
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme
  }
  
  // 其次检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  // 默认亮色主题
  return 'light'
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)

  // 切换主题函数
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置过主题时才跟随系统
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!savedTheme) {
        setThemeMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 应用主题变化
  useEffect(() => {
    // 应用基础主题CSS变量
    applyBaseTheme(themeConfigs[themeMode])
  }, [themeMode])

  const contextValue: ThemeContextType = {
    themeMode,
    toggleTheme,
    isDark: themeMode === 'dark'
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}