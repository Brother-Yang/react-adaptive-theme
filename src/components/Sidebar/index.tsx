import React from 'react';
import { useResponsiveComponent } from '../../hooks/useResponsiveComponent';
import SidebarSm from './index.sm';
import SidebarMd from './index.md';
import SidebarLg from './index.lg';
import './index.less';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * 响应式Sidebar组件
 * 根据屏幕尺寸自动选择合适的Sidebar变体：
 * - xs, sm: SidebarSm (移动端)
 * - md: SidebarMd (平板端)
 * - lg, xl: SidebarLg (桌面端)
 */
const Sidebar: React.FC<SidebarProps> = props => {
  const ResponsiveSidebar = useResponsiveComponent({
    sm: SidebarSm,
    md: SidebarMd,
    lg: SidebarLg,
  }, 'lg');

  return <ResponsiveSidebar {...props} />;
};

export default Sidebar;
