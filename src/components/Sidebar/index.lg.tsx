import React, { useState } from 'react';
import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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

// 生成菜单项的函数
const createMenuItems = (t: (key: string) => string): MenuItem[] => [
  getItem(t('sidebar.dashboard'), '1', <DashboardOutlined />), 
  getItem(t('sidebar.userManagement'), 'sub1', <UserOutlined />, [
    getItem(t('sidebar.userList'), '2'),
    getItem(t('sidebar.roleManagement'), '3'),
    getItem(t('sidebar.permissionSettings'), '4'),
  ]),
  getItem(t('sidebar.contentManagement'), 'sub2', <FileTextOutlined />, [
    getItem(t('sidebar.articleManagement'), '5'),
    getItem(t('sidebar.categoryManagement'), '6'),
  ]),
  getItem(t('sidebar.teamCollaboration'), 'sub3', <TeamOutlined />, [
    getItem(t('sidebar.projectManagement'), '7'),
    getItem(t('sidebar.taskAssignment'), '8'),
  ]),
  getItem(t('sidebar.systemSettings'), 'sub4', <SettingOutlined />, [
    getItem(t('sidebar.basicSettings'), '9'),
    getItem(t('sidebar.securitySettings'), '10'),
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
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState(['sub1']);
  
  // 根据当前语言生成菜单项
  const items = createMenuItems(t);

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
            <span className="logo-text">{t('header.title')}</span>
            <span className="logo-subtitle">{t('header.subtitle')}</span>
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