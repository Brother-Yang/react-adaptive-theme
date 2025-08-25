import React from 'react';
import { Layout, Breadcrumb, Avatar, Dropdown, Space, Button, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';
import './Header.less';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('跳转到个人中心');
        break;
      case 'settings':
        console.log('跳转到账户设置');
        break;
      case 'logout':
        console.log('退出登录');
        break;
    }
  };

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="trigger"
        />
        <Breadcrumb
          className="breadcrumb"
          items={[
            {
              title: '首页',
            },
            {
              title: '仪表盘',
            },
          ]}
        />
      </div>
      
      <div className="header-right">
        <Space size="middle">
          <ThemeToggle />
          
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notification-btn"
          />
          
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="user-info">
              <Avatar size="small" icon={<UserOutlined />} />
              <span className="username">管理员</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default AppHeader;