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

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'default', 
  showLabel = false,
  className = ''
}) => {
  const { toggleTheme, isDark } = useTheme()

  const tooltipTitle = isDark ? '切换到亮色模式' : '切换到暗色模式'

  return (
    <div className={`theme-toggle ${className}`}>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? '暗色模式' : '亮色模式'}
        </span>
      )}
      <Tooltip title={tooltipTitle} placement="bottom">
        <Switch
          size={size}
          checked={isDark}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className="theme-toggle-switch"
        />
      </Tooltip>
    </div>
  )
}

export default ThemeToggle