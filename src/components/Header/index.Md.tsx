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
import { useAutoTranslation } from '../../hooks/useAutoTranslation';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import './index.less';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 平板端Header组件
 * 专为中等屏幕设备（md）优化
 * - 显示简化的面包屑导航
 * - 显示通知按钮
 * - 显示用户名但使用较小字体
 * - 使用中等间距
 */
const HeaderMd: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { tAuto } = useAutoTranslation();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: tAuto('个人中心'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: tAuto('账户设置'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: tAuto('退出登录'),
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
    <AntHeader className={`app-header tablet ${collapsed ? 'collapsed' : ''}`}>
      <div className='header-left'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className='trigger'
        />
        {/* 平板端显示简化面包屑 */}
        <Breadcrumb
          className='breadcrumb compact'
          items={[
            {
              title: tAuto('首页'),
            },
            {
              title: tAuto('仪表盘'),
            },
          ]}
        />
      </div>

      <div className='header-right'>
        <Space size='middle'>
          <ThemeToggle />
          <LanguageToggle />

          <Button type='text' icon={<BellOutlined />} className='notification-btn' />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement='bottomRight'
            arrow
          >
            <div className='user-info tablet'>
              <Avatar size='default' icon={<UserOutlined />} />
              <span className='username compact'>{tAuto('管理员')}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default HeaderMd;
