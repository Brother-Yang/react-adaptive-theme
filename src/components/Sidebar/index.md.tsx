import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import './index.less';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 菜单项将在组件内部根据当前语言动态生成

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * 平板端Sidebar组件
 * 专为中等屏幕设备（md）优化
 * - 使用固定侧边栏模式
 * - 支持折叠/展开功能
 * - 适中的宽度和间距
 * - 优化的触摸交互
 */
const SidebarMd: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);

  // 根据当前语言生成菜单项
  const items: MenuItem[] = [getItem($tAuto('仪表盘'), '1', <DashboardOutlined />)];

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSelectedKeys([e.key]);
  };

  const sidebarContent = (
    <>
      <div className='sidebar-logo tablet'>
        <div className='logo-icon'>
          <DashboardOutlined />
        </div>
        {!collapsed && <span className='logo-text'>{$tAuto('管理系统')}</span>}
      </div>
      <Menu
        mode='inline'
        theme='light'
        selectedKeys={selectedKeys}
        defaultOpenKeys={collapsed ? [] : ['sub1']} // 折叠时不展开子菜单
        items={items}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
        className='sidebar-menu tablet'
      />
    </>
  );

  return <div className={`sidebar tablet ${collapsed ? 'collapsed' : ''}`}>{sidebarContent}</div>;
};

export default SidebarMd;
