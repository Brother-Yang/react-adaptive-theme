# React Responsive Theme App

一个基于 React + TypeScript + Ant Design 的现代化响应式主题应用，支持智能断点切换、组件级响应式设计和暗色/亮色主题无缝切换。

## ✨ 功能特性

- 🎨 **主题切换**: 支持亮色/暗色主题无缝切换，主题状态持久化存储
- 📱 **智能响应式**: 基于五级断点 (sm/md/lg/xl/xxl) 的组件级响应式设计
- 🔌 **响应式插件**: 自研 Vite 插件，支持组件按断点自动切换，动态导入优化性能
- 🌍 **自动国际化**: 编译时key生成的高性能国际化系统，支持自动翻译、插值变量和智能key优化
- ⚡ **性能优化**: 编译时预生成翻译key，运行时零开销，大幅提升性能
- 🧹 **智能清理**: 自动清理未使用的翻译词条，保持翻译文件整洁
- 🚄 **多级缓存**: 文件扫描缓存、AST缓存、批量I/O优化，显著提升处理速度
- 🎯 **断点优化**: 修复断点切换bug，支持快速切换无延迟
- 🎯 **现代化UI**: 使用 Ant Design 5.x 组件库，界面美观现代
- 🔧 **TypeScript**: 完整的 TypeScript 支持，类型安全
- 📊 **断点调试**: 内置断点指示器，方便开发调试
- 🎛️ **侧边栏**: 可折叠的侧边栏导航，移动端自动切换为抽屉模式
- 🎪 **组件展示**: 丰富的 Ant Design 组件使用示例
- 🚀 **React 19**: 支持最新的 React 19.1.1 版本

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **开发语言**: TypeScript 5.8.3
- **UI组件库**: Ant Design 5.27.1
- **图标库**: @ant-design/icons 6.0.0
- **样式预处理**: Less 4.4.1
- **构建工具**: Vite 7.1.2
- **国际化**: react-i18next 15.7.3 + i18next 25.4.2 + 自研自动国际化系统
- **代码规范**: ESLint 9.33.0
- **AST解析**: @babel/parser 7.28.3 + @babel/traverse 7.28.3
- **React 19兼容**: @ant-design/v5-patch-for-react-19 1.0.3

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

# 生成翻译文件
node scripts/generate-translations.js

# 或使用 npm script (推荐)
npm run translate
# 或
pnpm translate
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
scripts/                # 脚本工具
├── generate-translations.js # 自动翻译脚本
└── scripts/
    └── .translation-cache.json # 翻译缓存文件
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
- **智能key优化**: 英文长文本自动截取前30字符+12位hash，确保可读性和唯一性
- **灵活翻译模式**: 支持 `tAuto("文本")` 自动生成key 和 `tAuto("文本", {key: "custom.key"})` 手动指定key
- **插值变量**: 完全兼容react-i18next的插值语法
- **实时更新**: 开发时自动更新翻译文件
- **高安全性**: 中文文本使用MD5 hash前12位，降低冲突概率
- **自动清理**: 智能清理未使用的翻译词条，保持文件整洁
- **性能优化**: 多级缓存机制，批量I/O操作，显著提升处理速度

### 🤖 自动翻译脚本

项目还包含了一个高性能的自动翻译脚本 `generate-translations.js`，具有以下特性：

- **🔄 并发翻译**: 使用 p-limit 控制并发数量，提升翻译效率
- **📦 批量处理**: 合并短文本进行批量翻译，减少API调用次数  
- **💾 智能缓存**: MD5哈希缓存系统，避免重复翻译
- **⚡ 增量更新**: 只翻译新增或修改的内容，大幅提升性能
- **🛡️ 错误重试**: 智能重试机制，提高翻译成功率
- **📊 性能监控**: 详细的执行时间和缓存统计

#### 快速使用

```bash
# 使用 npm script (推荐)
npm run translate
# 或
pnpm translate

# 直接运行脚本
node scripts/generate-translations.js
```

详细使用说明请参考 [翻译脚本使用指南](./TRANSLATION_SCRIPT_GUIDE.md)

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
- **智能key生成**: 中文文本使用MD5 hash前12位，英文文本转驼峰命名
- **长度优化**: 英文key超过30字符时自动截取并添加hash后缀
- **key映射生成**: 自动生成完整的key-value映射表
- **客户端注入**: 通过HTML转换将映射表注入到客户端
- **性能优化**: 移除运行时key生成逻辑，大幅提升性能
- **AST解析**: 使用Babel解析器精确识别翻译函数调用
- **自动清理**: 智能检测并清理未使用的翻译词条
- **多级缓存**: 文件列表缓存、AST缓存、内容缓存，显著提升扫描速度
- **批量I/O**: 防抖写入、去重处理、并行操作，优化文件读写性能

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
      supportedLocales: ['zh-CN', 'en-US'],
      // 启用清理功能（默认开启）
      enableCleanup: true,
      // 指定清理的命名空间（默认只清理auto命名空间）
      cleanupNamespaces: ['auto']
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
6. 使用 `useAutoTranslation` hook 实现国际化

### 国际化最佳实践
1. **短文本使用自动key**: `tAuto('保存')` - 系统自动生成key
2. **长文本使用手动key**: `tAuto('用户数据已成功保存', { key: 'user.save.success' })`
3. **插值变量**: `tAuto('欢迎 {{name}}', { name: userName })`
4. **避免动态文本**: 不要使用字符串拼接，使用插值变量代替

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

## 🆕 最新特性 (v3.1.0)

### 自动国际化系统重大升级
- **🧹 智能清理功能**: 自动检测并清理未使用的翻译词条，保持翻译文件整洁
- **🚄 性能大幅优化**: 多级缓存机制，文件扫描速度提升3-5倍
- **📦 批量I/O优化**: 防抖写入、去重处理、并行操作，减少文件读写开销
- **🔧 代码结构优化**: 重构核心逻辑，提高代码质量和维护性
- **🛡️ 增强错误处理**: 完善的异常捕获和容错机制，提升系统稳定性
- **📊 性能监控**: 详细的性能指标和日志输出，便于调试和优化

### 清理功能特性
- **智能扫描**: 扫描所有源码文件，识别实际使用的翻译key
- **命名空间过滤**: 只清理指定命名空间中的未使用key（默认仅清理`auto`命名空间）
- **安全保护**: 手动指定的key和其他命名空间的key不会被清理
- **实时清理**: 文件变更时自动触发清理检查

### 性能优化成果
- **多级缓存**: 文件列表缓存（5秒TTL）、AST缓存、内容缓存
- **批量处理**: 200ms防抖机制，合并频繁的文件写入操作
- **并行优化**: Promise.all并行处理多个文件操作
- **内存优化**: 统一的对象操作工具，减少内存占用

### React 19 完全支持
- **最新版本**: 升级到 React 19.1.1
- **兼容性补丁**: 集成 @ant-design/v5-patch-for-react-19
- **类型安全**: 完整的 TypeScript 19.1.10 类型支持

### 开发体验改进
- **实时翻译更新**: 开发时自动检测并更新翻译文件
- **智能错误提示**: 更详细的构建错误信息和解决建议
- **调试工具**: 增强的断点指示器和响应式调试功能

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