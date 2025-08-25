import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
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
  getItem('数据管理', 'sub2', <TableOutlined />, [
    getItem('数据列表', '5'),
    getItem('数据分析', '6'),
  ]),
  getItem('统计报表', '7', <BarChartOutlined />),
  getItem('订单管理', '8', <ShoppingCartOutlined />),
  getItem('团队管理', 'sub3', <TeamOutlined />, [
    getItem('团队列表', '9'),
    getItem('部门管理', '10'),
  ]),
  getItem('文档中心', '11', <FileTextOutlined />),
  getItem('系统设置', '12', <SettingOutlined />),
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <DashboardOutlined />
        </div>
        {!collapsed && <span className="logo-text">管理后台</span>}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        defaultOpenKeys={['sub1']}
        items={items}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
        className="sidebar-menu"
      />
    </div>
  );
};

export default Sidebar;