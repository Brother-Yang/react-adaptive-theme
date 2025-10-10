import React, { useState, useEffect, useTransition, useOptimistic } from 'react';
import type { ReactNode } from 'react';
import { THEME_STORAGE_KEY, type ThemeMode, themeConfigs, applyBaseTheme } from '../config/theme';
import { ThemeContext, type ThemeContextType } from './ThemeContextDefinition';

// 主题提供者组件Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 获取初始主题
const getInitialTheme = (): ThemeMode => {
  // 优先从localStorage获取
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme;
  }

  // 其次检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 默认亮色主题
  return 'light';
};

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [isPending, startTransition] = useTransition();
  
  // 使用 useOptimistic 来提供即时的视觉反馈
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    themeMode,
    (_currentTheme: ThemeMode, newTheme: ThemeMode) => newTheme,
  );

  // 切换主题函数 - 使用 useTransition 优化性能
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    
    // 立即更新乐观状态，提供即时视觉反馈
    setOptimisticTheme(newTheme);
    
    // 在 transition 中执行实际的状态更新
    startTransition(() => {
      setThemeMode(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置过主题时才跟随系统
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 应用主题变化 - 使用乐观主题进行即时更新
  useEffect(() => {
    // 应用基础主题CSS变量
    applyBaseTheme(themeConfigs[optimisticTheme]);
  }, [optimisticTheme]);

  const contextValue: ThemeContextType = {
    themeMode: optimisticTheme, // 使用乐观主题提供即时反馈
    toggleTheme,
    isDark: optimisticTheme === 'dark',
    isPending, // 提供加载状态给组件使用
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
