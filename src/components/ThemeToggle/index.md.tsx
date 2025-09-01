import React from 'react'
import { Switch, Tooltip } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import './index.less'

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
  const { t } = useTranslation()

  const tooltipTitle = isDark ? t('theme.switchToLight') : t('theme.switchToDark')

  return (
    <div className={`theme-toggle tablet ${className}`}>
      {showLabel && (
        <span className="theme-toggle-label tablet">
          {isDark ? t('theme.darkShort') : t('theme.lightShort')}
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