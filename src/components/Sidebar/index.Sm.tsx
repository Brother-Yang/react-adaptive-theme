import React, { useState } from 'react';
import { Menu, Drawer, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
} from '@ant-design/icons';
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
 * 移动端Sidebar组件
 * 专为小屏幕设备（xs, sm）优化
 * - 使用抽屉模式显示
 * - 点击菜单项后自动收起
 * - 简化的Logo显示
 * - 触摸友好的交互
 */
const SidebarSm: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
    // 移动端点击菜单项后自动收起侧边栏
    if (onCollapse) {
      onCollapse(true);
    }
  };

  const sidebarContent = (
    <>
      <div className="sidebar-logo mobile">
        <div className="logo-icon">
          <DashboardOutlined />
        </div>
        <span className="logo-text">管理后台</span>
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        defaultOpenKeys={['sub1']}
        items={items}
        onClick={handleMenuClick}
        className="sidebar-menu mobile"
      />
    </>
  );

  return (
    <Drawer
      title={null}
      placement="left"
      closable={false}
      onClose={() => onCollapse?.(true)}
      open={!collapsed}
      styles={{ body: { padding: 0 } }}
      width={280} // 移动端稍宽一些，便于触摸操作
      className="sidebar-drawer mobile"
    >
      <div className="sidebar mobile">
        {sidebarContent}
      </div>
    </Drawer>
  );
};

export default SidebarSm;