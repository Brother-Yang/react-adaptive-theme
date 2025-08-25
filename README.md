# Theme App

一个基于 React + TypeScript + Ant Design 的现代化主题切换应用，支持响应式设计和暗色/亮色主题切换。

## ✨ 功能特性

- 🎨 **主题切换**: 支持亮色/暗色主题无缝切换
- 📱 **响应式设计**: 基于国际标准断点 (xs/sm/md/lg/xl) 的完全响应式布局
- 🎯 **现代化UI**: 使用 Ant Design 5.x 组件库，界面美观现代
- 🔧 **TypeScript**: 完整的 TypeScript 支持，类型安全
- 📊 **断点调试**: 内置断点指示器，方便开发调试
- 🎛️ **侧边栏**: 可折叠的侧边栏导航，移动端自动切换为抽屉模式
- 🎪 **组件展示**: 丰富的 Ant Design 组件使用示例

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **开发语言**: TypeScript 5.8.3
- **UI组件库**: Ant Design 5.27.1
- **图标库**: @ant-design/icons 6.0.0
- **样式预处理**: Less 4.4.1
- **构建工具**: Vite 7.1.2
- **代码规范**: ESLint 9.33.0

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>
cd theme-app

# 安装依赖 (推荐使用 pnpm)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 🚀 运行

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 代码检查
pnpm lint
```

开发服务器启动后，访问 [http://localhost:5173](http://localhost:5173) 查看应用。

## 📱 响应式断点

项目采用国际标准的五分类响应式断点：

| 断点 | 设备类型 | 屏幕宽度 | 侧边栏宽度 |
|------|----------|----------|------------|
| xs | 手机竖屏 | < 576px | 抽屉模式 |
| sm | 手机横屏 | 576px - 767px | 抽屉模式 |
| md | 平板设备 | 768px - 991px | 240px |
| lg | 桌面设备 | 992px - 1199px | 256px |
| xl | 大屏设备 | ≥ 1200px | 280px |

## 🎨 主题系统

### 主题切换
- 支持亮色/暗色主题切换
- 主题状态持久化存储
- 平滑的主题切换动画

### 自定义主题
项目使用 Ant Design 的主题定制功能，主题配置位于 `src/config/theme.ts`：

```typescript
// 亮色主题配置
export const lightTheme = {
  token: {
    colorPrimary: '#1677ff',
    // 更多配置...
  }
}

// 暗色主题配置
export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    // 更多配置...
  }
}
```

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── AppWithTheme.tsx    # 主题包装组件
│   ├── BreakpointIndicator # 断点指示器
│   ├── Header             # 头部组件
│   ├── Sidebar           # 侧边栏组件
│   └── ThemeToggle       # 主题切换组件
├── contexts/           # React Context
│   ├── ThemeContext.tsx   # 主题上下文
│   └── ThemeContextDefinition.ts
├── hooks/              # 自定义 Hooks
│   ├── useBreakpoint.ts   # 断点检测 Hook
│   └── useTheme.ts        # 主题管理 Hook
├── config/             # 配置文件
│   └── theme.ts           # 主题配置
├── App.tsx             # 主应用组件
├── App.less            # 全局样式
├── main.tsx            # 应用入口
└── index.less          # 基础样式
```

## 🔧 核心功能

### 1. 响应式断点检测

```typescript
import { useBreakpoint } from './hooks/useBreakpoint'

function MyComponent() {
  const breakpoint = useBreakpoint()
  
  return (
    <div>
      <p>当前断点: {breakpoint.current}</p>
      <p>是否移动端: {breakpoint.isMobile ? '是' : '否'}</p>
    </div>
  )
}
```

### 2. 主题切换

```typescript
import { useTheme } from './hooks/useTheme'

function ThemeButton() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '切换到亮色' : '切换到暗色'}
    </button>
  )
}
```

## 🎯 开发指南

### 添加新组件
1. 在 `src/components/` 目录下创建组件文件
2. 创建对应的 `.less` 样式文件
3. 确保组件支持主题切换和响应式设计

### 样式开发
- 使用 Less 预处理器
- 遵循 BEM 命名规范
- 使用 CSS 变量支持主题切换
- 采用移动优先的响应式设计

### 类型定义
- 所有组件都有完整的 TypeScript 类型定义
- 使用接口定义组件 Props
- 导出必要的类型供其他组件使用

## 🤝 贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - 企业级UI设计语言
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集