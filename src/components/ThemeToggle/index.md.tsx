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
 * 平板端ThemeToggle组件
 * 专为中等屏幕设备（md）优化
 * - 使用默认尺寸开关
 * - 可选择显示文字标签
 * - 完整的工具提示
 * - 适中的布局间距
 */
const ThemeToggleMd: React.FC<ThemeToggleProps> = ({
  size = 'default',
  showLabel = false,
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
    <div className={`theme-toggle tablet ${className}`}>
      {showLabel && (
        <span className='theme-toggle-label tablet'>
          {isDark ? $tAuto('深色') : $tAuto('浅色')}
        </span>
      )}
      <Tooltip title={tooltipTitle} placement='bottom'>
        <Switch
          size={size}
          checked={isDark}
          onChange={handleClick}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className='theme-toggle-switch tablet'
        />
      </Tooltip>
      <ColorPicker
        value={primaryColor || undefined}
        onChange={c => setPrimaryColor(c.toHexString())}
        size='small'
        className='theme-color-picker tablet'
      />
    </div>
  );
};

export default ThemeToggleMd;
