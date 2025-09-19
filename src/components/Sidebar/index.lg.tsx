import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

import './index.less';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 生成菜单项的函数
const createMenuItems = (): MenuItem[] => [getItem($tAuto('仪表盘'), '1', <DashboardOutlined />)];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * 桌面端Sidebar组件
 * 专为大屏幕设备（lg, xl）优化
 * - 使用固定侧边栏模式
 * - 支持完整的菜单层级
 * - 显示更多功能模块
 * - 宽松的间距和布局
 * - 支持折叠/展开动画
 */
const SidebarLg: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);

  // 根据当前语言生成菜单项
  const items = createMenuItems();

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSelectedKeys([e.key]);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const sidebarContent = (
    <>
      <div className='sidebar-logo desktop'>
        <div className='logo-icon'>
          <DashboardOutlined />
        </div>
        {!collapsed && (
          <div className='logo-content'>
            <span className='logo-text'>{$tAuto('管理系统')}</span>
            <span className='logo-subtitle'>{$tAuto('后台管理')}</span>
          </div>
        )}
      </div>
      <Menu
        mode='inline'
        theme='light'
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        items={items}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
        inlineCollapsed={collapsed}
        className='sidebar-menu desktop'
      />
    </>
  );

  return <div className={`sidebar desktop ${collapsed ? 'collapsed' : ''}`}>{sidebarContent}</div>;
};

export default SidebarLg;
