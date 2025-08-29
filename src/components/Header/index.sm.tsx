import React from 'react';
import { Layout, Avatar, Dropdown, Space, Button, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import ThemeToggle from '../ThemeToggle';
import './index.less';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 移动端Header组件
 * 专为小屏幕设备（xs, sm）优化
 * - 隐藏面包屑导航
 * - 隐藏通知按钮
 * - 隐藏用户名，只显示头像
 * - 使用更紧凑的间距
 */
const HeaderSm: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
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

  console.log('sm')

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
    <AntHeader className={`app-header mobile ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="trigger"
          size="small"
        />
        {/* 移动端可以显示简化的标题 */}
        <span className="mobile-title">控制台</span>
      </div>
      
      <div className="header-right">
        <Space size="small">
          <ThemeToggle />
          
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="user-info mobile">
              <Avatar size="small" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default HeaderSm;