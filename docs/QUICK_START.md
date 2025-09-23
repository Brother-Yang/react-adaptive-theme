# 快速开始指南

欢迎使用 React Adaptive Theme！本指南将帮助你在几分钟内启动并运行这个现代化的 React 应用模板。

## 🚀 快速启动

### 1. 环境要求

确保你的开发环境满足以下要求：

- **Node.js**: >= 18.0.0
- **包管理器**: pnpm (推荐) 或 npm
- **操作系统**: Windows、macOS 或 Linux

### 2. 安装依赖

```bash
# 推荐使用 pnpm（更快、更节省空间）
pnpm install

# 或使用 npm
npm install
```

### 3. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

服务器启动后，在浏览器中访问 `http://localhost:5173` 即可看到应用。

### 4. 构建生产版本

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🎯 核心功能体验

### 主题切换
- 点击右上角的主题切换按钮，体验亮色/暗色主题切换
- 主题选择会自动保存，下次访问时保持你的偏好

### 响应式设计
- 调整浏览器窗口大小，观察组件如何根据屏幕尺寸自动切换
- 访问 `/responsive-debug` 查看当前断点信息

### 国际化
- 点击语言切换按钮，在中文和英文之间切换
- 所有文本都会自动翻译，包括动态内容

### 路由导航
- 使用侧边栏导航在不同页面间切换
- 在移动设备上，侧边栏会自动切换为抽屉模式

## 📁 项目结构概览

```
react-adaptive-theme/
├── 📁 src/
│   ├── 📁 components/          # 可复用组件
│   │   ├── Header/            # 响应式头部
│   │   ├── ThemeToggle/       # 主题切换
│   │   └── LanguageToggle/    # 语言切换
│   ├── 📁 pages/              # 页面组件
│   │   ├── Home/              # 主页
│   │   └── About/             # 关于页面
│   ├── 📁 contexts/           # React上下文
│   ├── 📁 hooks/              # 自定义Hooks
│   ├── 📁 config/             # 配置文件
│   ├── 📁 locales/            # 翻译文件
│   └── 📁 router/             # 路由配置
├── 📁 plugins/                # Vite插件
├── 📁 scripts/                # 构建脚本
└── 📁 docs/                   # 文档
```

## 🛠️ 开发工作流

### 1. 添加新页面

1. 在 `src/pages/` 下创建新的页面文件夹
2. 创建 `index.tsx` 组件文件
3. 创建 `route.json` 配置文件（可选）
4. 路由会自动生成，无需手动配置

示例：
```bash
# 创建新页面
mkdir src/pages/NewPage
touch src/pages/NewPage/index.tsx
touch src/pages/NewPage/route.json
```

### 2. 添加新组件

1. 在 `src/components/` 下创建组件文件夹
2. 创建组件文件和样式文件
3. 如需响应式，可创建不同断点的组件版本

### 3. 添加翻译

1. 在代码中使用 `t('翻译内容')` 或 `t('translationKey')`
2. 运行 `pnpm translate` 自动生成翻译
3. 翻译文件会自动更新到 `src/locales/`

### 4. 自定义主题

1. 编辑 `src/config/theme.ts` 修改主题配置
2. 在 CSS 中使用 CSS 变量定义样式
3. 主题切换会自动应用新的颜色值

## 🎨 自定义配置

### 响应式断点

在 `plugins/vite-plugin-react-responsive.ts` 中修改断点配置：

```typescript
const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}
```

### 主题颜色

在 `src/config/theme.ts` 中自定义主题颜色：

```typescript
export const lightTheme = {
  primaryColor: '#1890ff',
  backgroundColor: '#ffffff',
  textColor: '#000000'
}
```

### 国际化配置

在 `src/config/i18n.ts` 中配置支持的语言：

```typescript
export const supportedLanguages = ['zh-CN', 'en-US']
```

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify 部署

1. 运行 `pnpm build` 构建项目
2. 将 `dist` 文件夹上传到 Netlify
3. 配置重定向规则支持 SPA 路由

### 自定义服务器

1. 构建项目：`pnpm build`
2. 将 `dist` 文件夹部署到你的服务器
3. 配置 Web 服务器支持 SPA 路由

## 📚 深入学习

现在你已经成功启动了项目！接下来可以深入学习各个功能模块：

- [**主题系统**](./theme/THEME_IMPLEMENTATION.md) - 了解主题切换的实现原理
- [**响应式设计**](./responsive/PLUGIN_DOCUMENTATION.md) - 学习响应式插件的使用
- [**国际化系统**](./i18n/AUTO_I18N_GUIDE.md) - 掌握自动国际化的配置
- [**路由系统**](./routing/NESTED_ROUTES_GUIDE.md) - 探索自动路由的强大功能

## 🤝 获得帮助

如果你遇到任何问题：

1. 查看相关文档了解详细信息
2. 检查控制台是否有错误信息
3. 确保所有依赖都已正确安装
4. 提交 Issue 获得社区帮助

祝你使用愉快！🎉