import React from 'react';
import { Layout, Avatar, Dropdown, Space, Button, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import ThemeToggle from '../ThemeToggle';
import Breadcrumbs from '../Breadcrumbs';
import LanguageToggle from '../LanguageToggle';
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
  console.log('xxl');

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: $tAuto('个人中心'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: $tAuto('账户设置'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: $tAuto('退出登录'),
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        // TODO: 实现跳转到个人中心功能
        break;
      case 'settings':
        // TODO: 实现跳转到账户设置功能
        break;
      case 'logout':
        // TODO: 实现退出登录功能
        break;
    }
  };

  return (
    <AntHeader className={`app-header desktop ${collapsed ? 'collapsed' : ''}`}>
      <div className='header-left'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className='trigger'
        />
        {/* 桌面端显示动态面包屑 */}
        <Breadcrumbs className='breadcrumb full' />
      </div>

      <div className='header-right'>
        <Space size='large'>
          <LanguageToggle />
          <ThemeToggle />

          {/* 桌面端可以显示更多功能按钮 */}
          <Button type='text' icon={<BellOutlined />} className='notification-btn' />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement='bottomRight'
            arrow
          >
            <div className='user-info desktop'>
              <Avatar size='default' icon={<UserOutlined />} />
              <div className='user-details'>
                <span className='username'>{$tAuto('管理员')}</span>
                <span className='user-role'>{$tAuto('系统管理员')}</span>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default HeaderLg;
