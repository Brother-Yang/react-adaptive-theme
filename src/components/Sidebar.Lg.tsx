import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
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

// 桌面端可以显示更多菜单项
const items: MenuItem[] = [
  getItem('仪表盘', '1', <DashboardOutlined />), 
  getItem('用户管理', 'sub1', <UserOutlined />, [
    getItem('用户列表', '2'),
    getItem('角色管理', '3'),
    getItem('权限设置', '4'),
  ]),
  getItem('内容管理', 'sub2', <FileTextOutlined />, [
    getItem('文章管理', '5'),
    getItem('分类管理', '6'),
  ]),
  getItem('团队协作', 'sub3', <TeamOutlined />, [
    getItem('项目管理', '7'),
    getItem('任务分配', '8'),
  ]),
  getItem('系统设置', 'sub4', <SettingOutlined />, [
    getItem('基础设置', '9'),
    getItem('安全设置', '10'),
  ]),
];

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

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const sidebarContent = (
    <>
      <div className="sidebar-logo desktop">
        <div className="logo-icon">
          <DashboardOutlined />
        </div>
        {!collapsed && (
          <div className="logo-content">
            <span className="logo-text">管理后台</span>
            <span className="logo-subtitle">Admin Dashboard</span>
          </div>
        )}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        items={items}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
        inlineCollapsed={collapsed}
        className="sidebar-menu desktop"
      />
    </>
  );

  return (
    <div className={`sidebar desktop ${collapsed ? 'collapsed' : ''}`}>
      {sidebarContent}
    </div>
  );
};

export default SidebarLg;