import React from 'react'
import { Switch, Tooltip } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../../hooks/useTheme'
import './index.less'

interface ThemeToggleProps {
  size?: 'small' | 'default'
  showLabel?: boolean
  className?: string
}

/**
 * 移动端ThemeToggle组件
 * 专为小屏幕设备（xs, sm）优化
 * - 使用小尺寸开关
 * - 隐藏文字标签
 * - 简化的工具提示
 * - 更紧凑的布局
 */
const ThemeToggleSm: React.FC<ThemeToggleProps> = ({ 
  size = 'small', 
  className = ''
}) => {
  const { toggleTheme, isDark } = useTheme()

  const tooltipTitle = isDark ? '亮色' : '暗色'

  return (
    <div className={`theme-toggle mobile ${className}`}>
      <Tooltip title={tooltipTitle} placement="bottom">
        <Switch
          size={size}
          checked={isDark}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className="theme-toggle-switch mobile"
        />
      </Tooltip>
    </div>
  )
}

export default ThemeToggleSm