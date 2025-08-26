import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Sidebar.less';

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

const items: MenuItem[] = [
  getItem('仪表盘', '1', <DashboardOutlined />), 
  getItem('用户管理', 'sub1', <UserOutlined />, [
    getItem('用户列表', '2'),
    getItem('角色管理', '3'),
    getItem('权限设置', '4'),
  ]),
];

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

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
  };

  const sidebarContent = (
    <>
      <div className="sidebar-logo tablet">
        <div className="logo-icon">
          <DashboardOutlined />
        </div>
        {!collapsed && <span className="logo-text">管理后台</span>}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        defaultOpenKeys={collapsed ? [] : ['sub1']} // 折叠时不展开子菜单
        items={items}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
        className="sidebar-menu tablet"
      />
    </>
  );

  return (
    <div className={`sidebar tablet ${collapsed ? 'collapsed' : ''}`}>
      {sidebarContent}
    </div>
  );
};

export default SidebarMd;