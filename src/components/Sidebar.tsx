import React, { useState } from 'react';
import { Menu, Drawer, type MenuProps } from 'antd';
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
import { useBreakpoint } from '../hooks/useBreakpoint';
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
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const breakpoint = useBreakpoint();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
    // 移动端点击菜单项后自动收起侧边栏
    if (breakpoint.isMobile && onCollapse) {
      onCollapse(true);
    }
  };

  const sidebarContent = (
    <>
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
        inlineCollapsed={collapsed && !breakpoint.isMobile}
        className="sidebar-menu"
      />
    </>
  );

  // 移动端使用抽屉模式
  if (breakpoint.isMobile) {
    return (
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => onCollapse?.(true)}
        open={!collapsed}
        bodyStyle={{ padding: 0 }}
        width={256}
        className="sidebar-drawer"
      >
        <div className="sidebar mobile">
          {sidebarContent}
        </div>
      </Drawer>
    );
  }

  // 桌面端和平板端使用固定侧边栏
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${breakpoint.current}`}>
      {sidebarContent}
    </div>
  );
};

export default Sidebar;