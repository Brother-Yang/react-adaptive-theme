import React from 'react'
import { useResponsiveComponent } from '../hooks/useResponsiveComponent'
import ThemeToggleSm from './ThemeToggle.Sm'
import ThemeToggleMd from './ThemeToggle.Md'
import ThemeToggleLg from './ThemeToggle.Lg'
import './ThemeToggle.less'

interface ThemeToggleProps {
  size?: 'small' | 'default'
  showLabel?: boolean
  className?: string
}

/**
 * 响应式ThemeToggle组件
 * 根据屏幕尺寸自动选择合适的ThemeToggle变体：
 * - xs, sm: ThemeToggleSm (移动端，小尺寸，无标签)
 * - md: ThemeToggleMd (平板端，默认尺寸，可选标签)
 * - lg, xl: ThemeToggleLg (桌面端，默认尺寸，显示标签)
 */
const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const ResponsiveThemeToggle = useResponsiveComponent({
    default: ThemeToggleLg, // 默认使用桌面端组件
    xs: ThemeToggleSm,
    sm: ThemeToggleSm,
    md: ThemeToggleMd,
    lg: ThemeToggleLg,
    xl: ThemeToggleLg,
  })

  return <ResponsiveThemeToggle {...props} />
}

export default ThemeToggle