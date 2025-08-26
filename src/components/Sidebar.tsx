import React from 'react';
import { useResponsiveComponent } from '../hooks/useResponsiveComponent';
import SidebarSm from './Sidebar.Sm';
import SidebarMd from './Sidebar.Md';
import SidebarLg from './Sidebar.Lg';
import './Sidebar.less';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * 响应式Sidebar组件
 * 根据屏幕尺寸自动选择合适的Sidebar变体：
 * - xs, sm: SidebarSm (移动端抽屉模式)
 * - md: SidebarMd (平板端固定侧边栏)
 * - lg, xl: SidebarLg (桌面端完整功能侧边栏)
 */
const Sidebar: React.FC<SidebarProps> = (props) => {
  const ResponsiveSidebar = useResponsiveComponent({
    default: SidebarLg, // 默认使用桌面端组件
    xs: SidebarSm,
    sm: SidebarSm,
    md: SidebarMd,
    lg: SidebarLg,
    xl: SidebarLg,
  });

  return <ResponsiveSidebar {...props} />;
};

export default Sidebar;