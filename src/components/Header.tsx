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
import { useBreakpoint } from '../hooks/useBreakpoint';
import './Header.less';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const breakpoint = useBreakpoint();
  
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
    <AntHeader className={`app-header ${breakpoint.current}`}>
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="trigger"
        />
        {/* 移动端隐藏面包屑 */}
        {!breakpoint.isMobile && (
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
        )}
      </div>
      
      <div className="header-right">
        <Space size={breakpoint.isMobile ? 'small' : 'middle'}>
          <ThemeToggle />
          
          {/* 平板和桌面端显示通知按钮 */}
          {!breakpoint.isMobile && (
            <Button
              type="text"
              icon={<BellOutlined />}
              className="notification-btn"
            />
          )}
          
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="user-info">
              <Avatar size={breakpoint.isMobile ? 'small' : 'default'} icon={<UserOutlined />} />
              {/* 移动端隐藏用户名 */}
              {!breakpoint.isMobile && <span className="username">管理员</span>}
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default AppHeader;