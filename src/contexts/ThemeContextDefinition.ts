import { createContext } from 'react';
import { type ThemeMode } from '../config/theme';
import React from 'react';

// 主题上下文类型
export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: (event?: React.MouseEvent) => void;
  isDark: boolean;
  isPending?: boolean; // 添加可选的pending状态
  // 自定义主题色（仅主色）
  primaryColor?: string | null;
  setPrimaryColor: (color: string | null, opts?: { persist?: boolean }) => void;
}

// 创建主题上下文
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
