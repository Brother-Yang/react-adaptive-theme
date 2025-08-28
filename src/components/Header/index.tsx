import React from 'react';
import { useResponsiveComponent } from '../../hooks/useResponsiveComponent';
import HeaderSm from './index.Sm';
import HeaderMd from './index.Md';
import HeaderLg from './index.Lg';
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
const AppHeader: React.FC<HeaderProps> = (props) => {
  const ResponsiveHeader = useResponsiveComponent({
    default: HeaderLg, // 默认使用桌面端组件
    xs: HeaderSm,
    sm: HeaderSm,
    md: HeaderMd,
    lg: HeaderLg,
    xl: HeaderLg,
  });

  return <ResponsiveHeader {...props} />;
};

export default AppHeader;