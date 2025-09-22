import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import autoRoutes from './auto-routes';
import React, { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

// 基于语言的边界组件：语言变化时仅重挂载对应的子树
const LanguageBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  return <React.Fragment key={i18n.language}>{children}</React.Fragment>;
};

// 递归转换路由配置，支持嵌套路由
const convertRoute = (route: any): any => {
  const converted: any = {
    element: route.element,
  };

  if (route.path === '/' && (!route.children || route.children.length === 0)) {
    converted.index = true;
  } else {
    converted.path = (route.path || '').startsWith('/')
      ? (route.path || '').slice(1)
      : route.path || '';
  }

  // 处理子路由
  if (route.children && route.children.length > 0) {
    converted.children = route.children.map(convertRoute);
  }

  return converted;
};

// 将自动路由转换为React Router格式
const routeChildren = autoRoutes.map(convertRoute);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routeChildren,
  },
]);

const AppRouter = () => {
  return (
    <LanguageBoundary>
      <RouterProvider router={router} />
    </LanguageBoundary>
  );
};

export default AppRouter;
