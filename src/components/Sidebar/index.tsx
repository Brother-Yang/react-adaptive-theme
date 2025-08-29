import React from 'react';

import SidebarLg from './index.lg';
import './index.less';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return <SidebarLg {...props} />;
};

export default Sidebar;