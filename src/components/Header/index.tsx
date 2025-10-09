import React from 'react';
import { useResponsiveComponent } from '../../hooks/useResponsiveComponent';
import HeaderSm from './index.sm';
import HeaderMd from './index.md';
import HeaderLg from './index.lg';
import HeaderXl from './index.xl';
import HeaderXXl from './index.xxl';
import './index.less';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 响应式Header组件
 * 根据屏幕尺寸自动选择合适的Header变体：
 * - xs, sm: HeaderSm (移动端)
 * - md: HeaderMd (平板端)
 * - lg, xl: HeaderLg (桌面端)
 */
const AppHeader: React.FC<HeaderProps> = props => {
  const ResponsiveHeader = useResponsiveComponent({
    sm: HeaderSm,
    md: HeaderMd,
    lg: HeaderLg,
    xl: HeaderXl,
    xxl: HeaderXXl,
  }, 'lg');

  return <ResponsiveHeader {...props} />;
};

export default AppHeader;
