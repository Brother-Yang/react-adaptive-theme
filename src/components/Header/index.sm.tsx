import React from 'react';
import { Layout, Avatar, Dropdown, Space, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../LanguageToggle';
import { createUserMenuItems, handleUserMenuClick, type HeaderProps } from './shared';
import './index.less';

const { Header: AntHeader } = Layout;

/**
 * 移动端Header组件
 * 专为小屏幕设备（xs, sm）优化
 * - 隐藏面包屑导航
 * - 隐藏通知按钮
 * - 隐藏用户名，只显示头像
 * - 使用更紧凑的间距
 */
const HeaderSm: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  console.log('sm');

  // 移动端使用共享的菜单项
  const userMenuItems = createUserMenuItems($tAuto);

  return (
    <AntHeader className={`app-header mobile ${collapsed ? 'collapsed' : ''}`}>
      <div className='header-left'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className='trigger'
          size='small'
        />
        {/* 移动端可以显示简化的标题 */}
        <span className='mobile-title'>{$tAuto('控制台')}</span>
      </div>

      <div className='header-right'>
        <Space size='small'>
          <ThemeToggle />
          <LanguageToggle />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement='bottomRight'
            arrow
          >
            <div className='user-info mobile'>
              <Avatar size='small' icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default HeaderSm;
