import React from 'react';
import HeaderLg from './index.lg';
import './index.less';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<HeaderProps> = props => {
  return <HeaderLg {...props} />;
};

export default AppHeader;
