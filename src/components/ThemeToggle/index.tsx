import React from 'react';
import { useResponsiveComponent } from '../../hooks/useResponsiveComponent';
import HeaderSm from './index.sm';
import HeaderMd from './index.md';
import HeaderLg from './index.lg';
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
const AppHeader: React.FC<ThemeToggleProps> = props => {
  const ResponsiveHeader = useResponsiveComponent({
    default: HeaderLg, // 默认使用桌面端组件
    sm: HeaderSm,
    md: HeaderMd,
    lg: HeaderLg,
  });

  return <ResponsiveHeader {...props} />;
};

export default AppHeader;
