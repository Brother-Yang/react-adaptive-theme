# React Responsive Theme App

一个基于 React + TypeScript + Ant Design 的现代化响应式主题应用，支持智能断点切换、组件级响应式设计和暗色/亮色主题无缝切换。

## ✨ 功能特性

- 🎨 **主题切换**: 支持亮色/暗色主题无缝切换
- 📱 **智能响应式**: 基于五级断点 (sm/md/lg/xl/xxl) 的组件级响应式设计
- 🔌 **响应式插件**: 自研 Vite 插件，支持组件按断点自动切换
- 🌍 **自动国际化**: 编译时key生成的高性能国际化系统，支持自动翻译和插值变量
- 🎯 **断点优化**: 修复断点切换bug，支持快速切换无延迟
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
- **国际化**: react-i18next + 自研自动国际化系统
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

## 📱 响应式断点系统

项目采用优化的五级响应式断点系统：

| 断点 | 设备类型 | 屏幕宽度范围 | 侧边栏宽度 | 说明 |
|------|----------|-------------|------------|------|
| sm | 小屏设备 | < 768px | 抽屉模式 | 手机设备，包含 < 576px 的超小屏 |
| md | 平板设备 | 768px - 991px | 240px | 平板竖屏 |
| lg | 桌面设备 | 992px - 1199px | 256px | 小型桌面 |
| xl | 大屏设备 | 1200px - 1399px | 280px | 标准桌面 |
| xxl | 超大屏 | ≥ 1400px | 300px | 大型显示器 |

### 断点配置
```typescript
export const BREAKPOINTS = {
  sm: 576,   // Small devices
  md: 768,   // Medium devices  
  lg: 992,   // Large devices
  xl: 1200,  // Extra large devices
  xxl: 1400  // Extra extra large devices
} as const;
```

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
│   ├── ThemeToggle       # 主题切换组件
│   ├── LanguageToggle    # 语言切换组件
│   └── TestTranslation   # 国际化测试组件
├── contexts/           # React Context
│   ├── ThemeContext.tsx   # 主题上下文
│   └── ThemeContextDefinition.ts
├── hooks/              # 自定义 Hooks
│   ├── useBreakpoint.ts   # 断点检测 Hook
│   ├── useResponsiveComponent.ts # 响应式组件 Hook
│   ├── useTheme.ts        # 主题管理 Hook
│   └── useAutoTranslation.ts # 自动翻译 Hook
├── config/             # 配置文件
│   ├── theme.ts           # 主题配置
│   └── i18n.ts            # 国际化配置
├── locales/            # 翻译文件
│   ├── zh-CN.json         # 中文翻译
│   └── en-US.json         # 英文翻译
├── App.tsx             # 主应用组件
├── App.less            # 全局样式
├── main.tsx            # 应用入口
├── styles/             # 样式文件
│   └── variables.less     # 样式变量
└── index.less          # 基础样式
plugins/
├── vite-plugin-react-responsive.ts # 响应式插件
└── vite-plugin-auto-i18n.ts        # 自动国际化插件
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
      <p>屏幕宽度: {breakpoint.width}px</p>
      <p>是否移动端: {breakpoint.isMobile ? '是' : '否'}</p>
      <p>是否PC端: {breakpoint.isPc ? '是' : '否'}</p>
    </div>
  )
}
```

### 2. 组件级响应式设计

项目支持为同一组件创建不同断点的版本：

```
components/Header/
├── index.tsx          # 默认组件
├── index.sm.tsx       # 小屏版本
├── index.md.tsx       # 平板版本
├── index.lg.tsx       # 桌面版本
├── index.xl.tsx       # 大屏版本
└── index.xxl.tsx      # 超大屏版本
```

系统会根据当前屏幕尺寸自动选择合适的组件版本。

### 3. 主题切换

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

## 🌍 自动国际化系统

项目集成了高性能的自动国际化系统，采用编译时key生成架构：

### 核心特性
- **编译时key生成**: 构建时预生成所有翻译key，运行时零开销
- **智能key处理**: 自动生成key或手动指定key，两种方式都会添加到JSON文件
- **灵活翻译模式**: 支持 `tAuto("文本")` 自动生成key 和 `tAuto("文本", {key: "custom.key"})` 手动指定key
- **插值变量**: 完全兼容react-i18next的插值语法
- **实时更新**: 开发时自动更新翻译文件

### 基本使用

```typescript
import { useAutoTranslation } from '../hooks/useAutoTranslation';

function MyComponent() {
  const { tAuto, locale } = useAutoTranslation();
  
  return (
    <div>
      {/* 自动生成key - 插件会自动为文本生成唯一key */}
      <h1>{tAuto('欢迎使用系统')}</h1>
      
      {/* 手动指定key - 插件会将指定的key添加到JSON文件 */}
      <p>{tAuto('系统运行正常', { key: 'system.status.ok' })}</p>
      
      {/* 插值变量 */}
      <p>{tAuto('欢迎 {{name}}', { name: '张三' })}</p>
      
      {/* 手动key + 插值 */}
      <p>{tAuto('用户 {{user}} 在线', { key: 'user.online', user: '张三' })}</p>
    </div>
  );
}
```

详细使用说明请参考 [AUTO_I18N_GUIDE.md](./AUTO_I18N_GUIDE.md)

## 🔌 Vite 插件系统

项目包含两个自研的 Vite 插件：

### 响应式插件 (vite-plugin-react-responsive)
- **自动组件切换**: 根据屏幕尺寸自动选择对应的组件版本
- **动态导入**: 按需加载组件，优化性能
- **开发调试**: 提供 `/responsive-debug` 端点查看插件配置
- **类型安全**: 完整的 TypeScript 支持

### 自动国际化插件 (vite-plugin-auto-i18n)
- **编译时扫描**: 构建时扫描所有源码文件中的翻译调用
- **key映射生成**: 自动生成完整的key-value映射表
- **客户端注入**: 通过HTML转换将映射表注入到客户端
- **性能优化**: 移除运行时key生成逻辑，大幅提升性能

### 插件配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactResponsivePlugin from './plugins/vite-plugin-react-responsive'
import autoI18nPlugin from './plugins/vite-plugin-auto-i18n'

export default defineConfig({
  plugins: [
    react(),
    // 响应式插件配置
    reactResponsivePlugin({
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
      },
      defaultBreakpoint: 'lg'
    }),
    // 自动国际化插件配置
    autoI18nPlugin({
      localesDir: 'src/locales',
      defaultLocale: 'zh-CN',
      supportedLocales: ['zh-CN', 'en-US']
    })
  ]
})
```

## 🎯 开发指南

### 添加响应式组件
1. 在 `src/components/` 目录下创建组件文件夹
2. 创建 `index.tsx` 作为默认组件
3. 根据需要创建 `index.{breakpoint}.tsx` 文件
4. 创建对应的 `.less` 样式文件
5. 确保组件支持主题切换

### 断点文件命名规范
- 默认组件: `index.tsx`
- 小屏组件: `index.sm.tsx`
- 平板组件: `index.md.tsx`
- 桌面组件: `index.lg.tsx`
- 大屏组件: `index.xl.tsx`
- 超大屏组件: `index.xxl.tsx`

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