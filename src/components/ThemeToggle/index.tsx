import React from 'react'
import ThemeToggleLg from './index.lg'
import './index.less'

interface ThemeToggleProps {
  size?: 'small' | 'default'
  showLabel?: boolean
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  return <ThemeToggleLg {...props} />
}

export default ThemeToggle