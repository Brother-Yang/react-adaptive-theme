import { createContext } from 'react';
import { type ThemeMode } from '../config/theme';

// 主题上下文类型
export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
  isPending?: boolean; // 添加可选的pending状态
}

// 创建主题上下文
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
