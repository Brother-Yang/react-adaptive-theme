# 嵌套路由使用指南

## 概述

自动路由插件现已支持嵌套路由结构，允许您创建多层级的页面组织方式。

## 功能特性

- ✅ 支持无限层级的嵌套路由
- ✅ 自动扫描子目录中的 `route.json` 配置
- ✅ 保持与现有路由配置的兼容性
- ✅ 自动生成正确的导入路径
- ✅ 支持热更新和实时重载

## 目录结构示例

```
src/pages/
├── Home/
│   ├── index.tsx          # 主页组件
│   ├── route.json         # 主页路由配置
│   └── Profile/           # 子路由目录
│       ├── index.tsx      # 用户资料组件
│       ├── Profile.less   # 样式文件
│       └── route.json     # 子路由配置
└── About/
    ├── index.tsx
    └── route.json 
```

## 路由配置格式

每个页面目录下的 `route.json` 文件格式保持不变：

```json
{
  "path": "/profile",
  "name": "Profile",
  "component": "./index.tsx",
  "autoRoute": true,
  "meta": {
    "title": "用户资料",
    "icon": "user"
  }
}
```

## 生成的路由结构

插件会自动生成嵌套的路由配置：

```typescript
export const autoRoutes = [
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
        path: '/profile',
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
```

## 使用说明

### 1. 创建嵌套路由

1. 在现有页面目录下创建子目录
2. 在子目录中创建 `index.tsx` 组件文件
3. 创建 `route.json` 配置文件
4. 设置 `autoRoute: true` 启用自动路由

### 2. 路径规则

- 子路由的 `path` 是相对于父路由的路径
- 最终的访问路径会自动组合父子路径
- 例如：`/` + `/profile` = `/profile`

### 3. 组件导入

插件会自动处理所有层级的组件导入，无需手动配置。

### 4. 热更新支持

当您修改任何 `route.json` 文件时，路由配置会自动重新生成并触发页面重载。

## 注意事项

1. **路径唯一性**：确保同一层级下的路由路径不重复
2. **组件命名**：建议使用有意义的组件名称，避免冲突
3. **文件结构**：保持清晰的目录结构，便于维护
4. **autoRoute 配置**：只有设置 `autoRoute: true` 的路由才会被自动生成

## 示例路由访问

基于上述配置，您可以访问以下路由：

- `/` - 主页
- `/about` - 关于页面
- `/contact` - 联系页面
- `/profile` - 用户资料页面（Home 的子路由）

## 扩展性

该嵌套路由系统支持：

- 无限层级嵌套
- 混合路由（部分页面有子路由，部分没有）
- 动态路由添加和删除
- 与现有路由系统完全兼容

通过这种方式，您可以构建复杂的多层级应用结构，同时保持代码的组织性和可维护性。