import React from 'react';
import { type MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

/**
 * 自动翻译函数类型
 */
export type AutoTranslationFunction = (text: string, options?: { key?: string }) => string;

/**
 * 用户菜单配置
 * @param $tAuto 自动翻译函数
 * @returns 菜单项配置
 */
export const createUserMenuItems = ($tAuto: AutoTranslationFunction): MenuProps['items'] => [
  {
    key: 'profile',
    icon: React.createElement(UserOutlined),
    label: $tAuto('个人中心'),
  },
  {
    key: 'settings',
    icon: React.createElement(SettingOutlined),
    label: $tAuto('账户设置'),
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: React.createElement(LogoutOutlined),
    label: $tAuto('退出登录'),
    danger: true,
  },
];

/**
 * 用户菜单点击处理函数
 * @param key 菜单项key
 */
export const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
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

/**
 * Header组件通用Props接口
 */
export interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * 面包屑导航配置
 */
export const breadcrumbItems = [
  {
    title: '首页',
  },
  {
    title: '用户管理',
  },
  {
    title: '用户列表',
  },
];
