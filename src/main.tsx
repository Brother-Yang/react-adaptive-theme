import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import SystemConfigProvider from '@/components/System/SystemConfigProvider';
import './config/i18n'; // 初始化i18n配置
import './index.less';
import { performanceMonitor } from './utils/performance.ts';

// 启用性能监控
if (import.meta.env.DEV) {
  performanceMonitor.enable();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SystemConfigProvider />
    </ThemeProvider>
  </StrictMode>
);
