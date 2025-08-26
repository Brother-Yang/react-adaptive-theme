import React from 'react'
import { Switch, Tooltip } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../hooks/useTheme'
import './ThemeToggle.less'

interface ThemeToggleProps {
  size?: 'small' | 'default'
  showLabel?: boolean
  className?: string
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
  className = ''
}) => {
  const { toggleTheme, isDark } = useTheme()

  const tooltipTitle = isDark ? '切换到亮色模式' : '切换到暗色模式'

  return (
    <div className={`theme-toggle tablet ${className}`}>
      {showLabel && (
        <span className="theme-toggle-label tablet">
          {isDark ? '暗色' : '亮色'}
        </span>
      )}
      <Tooltip title={tooltipTitle} placement="bottom">
        <Switch
          size={size}
          checked={isDark}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className="theme-toggle-switch tablet"
        />
      </Tooltip>
    </div>
  )
}

export default ThemeToggleMd