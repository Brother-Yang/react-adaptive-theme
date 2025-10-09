import React from 'react';
import { useResponsiveComponent } from '../../hooks/useResponsiveComponent';
import ThemeToggleSm from './index.sm';
import ThemeToggleMd from './index.md';
import ThemeToggleLg from './index.lg';
import './index.less';

interface ThemeToggleProps {
  size?: 'small' | 'default';
  showLabel?: boolean;
  className?: string;
}

/**
 * 响应式Header组件
 * 根据屏幕尺寸自动选择合适的Header变体：
 * - xs, sm: HeaderSm (移动端)
 * - md: HeaderMd (平板端)
 * - lg, xl: HeaderLg (桌面端)
 */
const ThemeToggle: React.FC<ThemeToggleProps> = props => {
  const ResponsiveThemeToggle = useResponsiveComponent({
    sm: ThemeToggleSm,
    md: ThemeToggleMd,
    lg: ThemeToggleLg,
  }, 'lg');

  return <ResponsiveThemeToggle {...props} />;
};

export default ThemeToggle;
