// 此文件由 vite-plugin-auto-route 自动生成，请勿手动修改
import React from 'react';

import About from '../pages/About';
import Home from '../pages/Home';
import Profile from '../pages/Home/Profile';

export const autoRoutes = [
  {
    path: '/about',
    element: React.createElement(About),
    handle: {
      name: 'About',
      meta: {
          "title": "关于我们",
          "icon": "info"
      }
    }
  },
  {
    path: '/',
    element: React.createElement(Home),
    handle: {
      name: 'Home',
      meta: {
          "title": "首页",
          "icon": "home"
      }
    },
    children: [
    {
      path: 'profile',
      element: React.createElement(Profile),
      handle: {
        name: 'Profile',
        meta: {
            "title": "用户资料",
            "icon": "user"
        }
      }
    }
    ]
  }
];

export default autoRoutes;
