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
import ThemeToggle from '../ThemeToggle';
import './index.less';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 桌面端Header组件
 * 专为大屏幕设备（lg, xl）优化
 * - 显示完整的面包屑导航
 * - 显示所有功能按钮
 * - 显示完整的用户信息
 * - 使用宽松的间距
 * - 可以显示更多操作按钮
 */
const HeaderLg: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
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

  console.log('xl')

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
    <AntHeader className={`app-header desktop ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="trigger"
        />
        {/* 桌面端显示完整面包屑 */}
        <Breadcrumb
          className="breadcrumb full"
          items={[
            {
              title: '首页',
            },
            {
              title: '工作台',
            },
            {
              title: '仪表盘',
            },
          ]}
        />
      </div>
      
      <div className="header-right">
        <Space size="large">
          <ThemeToggle />
          
          {/* 桌面端可以显示更多功能按钮 */}
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
            <div className="user-info desktop">
              <Avatar size="default" icon={<UserOutlined />} />
              <div className="user-details">
                <span className="username">管理员</span>
                <span className="user-role">系统管理员</span>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default HeaderLg;