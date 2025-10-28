import React from 'react';
import { Switch, Tooltip, ColorPicker } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import './index.less';

interface ThemeToggleProps {
  size?: 'small' | 'default';
  showLabel?: boolean;
  className?: string;
}

/**
 * 桌面端ThemeToggle组件
 * 专为大屏幕设备（lg, xl）优化
 * - 使用默认尺寸开关
 * - 默认显示完整文字标签
 * - 详细的工具提示信息
 * - 宽松的布局间距
 * - 支持更多自定义选项
 */
const ThemeToggleLg: React.FC<ThemeToggleProps> = ({
  size = 'default',
  showLabel = true,
  className = '',
}) => {
  const { toggleTheme, isDark, primaryColor, setPrimaryColor } = useTheme();
  const tooltipTitle = isDark ? $tAuto('切换到浅色主题') : $tAuto('切换到深色主题');

  const handleClick = (_checked: boolean, event: React.MouseEvent | React.KeyboardEvent) => {
    // 只有鼠标点击事件才触发动画
    if (event.type === 'click' && 'clientX' in event) {
      toggleTheme(event);
    } else {
      toggleTheme();
    }
  };

  return (
    <div className={`theme-toggle desktop ${className}`}>
      {showLabel && (
        <span className='theme-toggle-label desktop'>
          {isDark ? $tAuto('深色模式') : $tAuto('浅色模式')}
        </span>
      )}
      <Tooltip title={tooltipTitle} placement='bottom'>
        <Switch
          size={size}
          checked={isDark}
          onChange={handleClick}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className='theme-toggle-switch desktop'
        />
      </Tooltip>
      <ColorPicker
        value={primaryColor || undefined}
        onChange={c => setPrimaryColor(c.toHexString())}
        size='small'
        className='theme-color-picker desktop'
      />
    </div>
  );
};

export default ThemeToggleLg;
