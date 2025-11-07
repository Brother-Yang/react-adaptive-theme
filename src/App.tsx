import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Card, Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Sidebar from './components/Sidebar';
import RouterProgressBar from './components/RouterProgressBar';
import AppHeader from './components/Header';
import BreakpointIndicator from './components/BreakpointIndicator';
import TestTranslation from './components/TestTranslation';
import LocalResponsiveExample from './components/LocalResponsiveExample';
import { useBreakpoint } from './hooks/useBreakpoint';
import './App.less';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const breakpoint = useBreakpoint();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 移动端自动收起侧边栏
  useEffect(() => {
    if (breakpoint.isMobile) {
      setCollapsed(true);
    }
  }, [breakpoint.isMobile]);

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to='/'>{$tAuto('首页')}</Link>,
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: <Link to='/about'>{$tAuto('关于')}</Link>,
    },
  ];

  return (
    <Layout className='app'>
      <RouterProgressBar />
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className={`main-layout ${collapsed ? 'collapsed' : ''} ${breakpoint.current}`}>
        <AppHeader collapsed={collapsed} onToggle={toggleCollapsed} />
        <Content className='app-content'>
          {/* 导航菜单 */}
          <Card style={{ marginBottom: '16px' }}>
            <Menu
              mode='horizontal'
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ border: 'none' }}
            />
          </Card>

          {/* 路由内容 */}
          <Outlet />

          {/* 调试组件 */}
          <TestTranslation />
          <LocalResponsiveExample />
        </Content>
        <BreakpointIndicator />
      </Layout>
    </Layout>
  );
}

export default App;
