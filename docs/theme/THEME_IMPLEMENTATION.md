# 主题切换实现文档

## 概述

本项目实现了一套完整的主题切换系统，支持亮色和暗色两种主题模式。系统集成了 Ant Design 的主题配置和自定义 CSS 变量，实现了统一的主题管理。

## 架构设计

### 核心组件

1. **主题配置层** (`src/config/theme.ts`)
   - 定义主题配置和类型
   - 提供主题应用函数
   - 管理 CSS 变量映射

2. **上下文层** (`src/contexts/ThemeContext.tsx`)
   - 提供全局主题状态管理
   - 处理主题切换逻辑
   - 监听系统主题变化

3. **组件层** (`src/components/ThemeToggle.tsx`)
   - 提供用户界面交互
   - 触发主题切换操作

## 实现流程

### 1. 主题配置定义

#### 扩展主题配置类型
```typescript
export interface ExtendedThemeConfig extends ThemeConfig {
  base?: {
    colorPrimary?: string
    colorSuccess?: string
    colorWarning?: string
    colorError?: string
    colorText?: string
    colorTextSecondary?: string
    borderColorBase?: string
    backgroundColorBase?: string
    componentBackground?: string
    tableHeaderBg?: string
  }
}
```

#### 主题配置对象
- `lightTheme`: 亮色主题配置
- `darkTheme`: 暗色主题配置
- 每个主题包含 `algorithm`、`token` 和 `base` 三个部分

### 2. CSS 变量应用机制

#### applyBaseTheme 函数
```typescript
export const applyBaseTheme = (theme: ExtendedThemeConfig) => {
  if (!theme.base) return
  
  const root = document.documentElement
  const base = theme.base
  
  // 动态设置 CSS 自定义属性
  if (base.colorPrimary) root.style.setProperty('--base-color-primary', base.colorPrimary)
  // ... 其他属性设置
}
```

#### CSS 变量映射
| 配置属性 | CSS 变量 | 用途 |
|---------|----------|------|
| colorPrimary | --base-color-primary | 主色调 |
| colorText | --base-color-text | 主要文字颜色 |
| colorTextSecondary | --base-color-text-secondary | 次要文字颜色 |
| borderColorBase | --base-border-color-base | 基础边框颜色 |
| backgroundColorBase | --base-background-color-base | 基础背景颜色 |
| componentBackground | --base-component-background | 组件背景颜色 |
| tableHeaderBg | --base-table-header-bg | 表格头部背景 |

### 3. 主题状态管理

#### ThemeProvider 组件
- 使用 React Context 提供全局主题状态
- 管理主题模式的存储和读取
- 监听系统主题偏好变化

#### 主题初始化逻辑
1. 优先从 localStorage 读取用户设置
2. 其次检查系统主题偏好 (`prefers-color-scheme`)
3. 默认使用亮色主题

#### 主题切换流程
1. 用户点击主题切换按钮
2. 调用 `toggleTheme` 函数
3. 更新 `themeMode` 状态
4. 保存设置到 localStorage
5. 触发 useEffect 钩子
6. 更新 HTML 根元素的 `data-theme` 属性
7. 调用 `applyBaseTheme` 应用 CSS 变量

### 4. 样式应用机制

#### Ant Design 组件
- 通过 `ConfigProvider` 应用主题配置
- 使用 `algorithm` 和 `token` 属性控制组件样式

#### 自定义组件
- 使用 CSS 变量实现主题响应
- 通过 CSS 变量动态切换主题样式
- 动态更新的 CSS 自定义属性值

## 使用方式

### 1. 在组件中使用主题
```typescript
import { useTheme } from '../hooks/useTheme'

const MyComponent = () => {
  const { themeMode, toggleTheme, isDark } = useTheme()
  
  return (
    <div className={`my-component ${isDark ? 'dark' : 'light'}`}>
      <button onClick={toggleTheme}>
        切换到{isDark ? '亮色' : '暗色'}主题
      </button>
    </div>
  )
}
```

### 2. 在样式中使用 CSS 变量
```less
.my-component {
  color: var(--base-color-text);
  background-color: var(--base-component-background);
  border: 1px solid var(--base-border-color-base);
}
```

### 3. 添加新的主题变量
1. 在 `ExtendedThemeConfig` 接口中添加新属性
2. 在 `lightTheme` 和 `darkTheme` 的 `base` 对象中添加对应值
3. 在 `applyBaseTheme` 函数中添加 CSS 变量设置逻辑
4. 在样式文件中使用新的 CSS 变量

## 文件结构

```
src/
├── config/
│   └── theme.ts              # 主题配置和工具函数
├── contexts/
│   ├── ThemeContext.tsx      # 主题上下文提供者
│   └── ThemeContextDefinition.ts # 上下文类型定义
├── hooks/
│   └── useTheme.ts           # 主题钩子函数
├── components/
│   ├── AppWithTheme.tsx      # 应用主题包装器
│   └── ThemeToggle.tsx       # 主题切换组件
└── index.less                # 全局 CSS 变量定义
```

## 特性

- ✅ 支持亮色/暗色主题切换
- ✅ 自动跟随系统主题偏好
- ✅ 主题设置持久化存储
- ✅ Ant Design 组件主题集成
- ✅ 自定义组件主题支持
- ✅ TypeScript 类型安全
- ✅ CSS 变量动态更新
- ✅ 响应式主题切换动画

## 扩展性

系统设计具有良好的扩展性：

1. **添加新主题**：可以轻松添加更多主题模式（如高对比度主题）
2. **自定义变量**：支持添加更多 CSS 变量和配置项
3. **组件集成**：新组件可以轻松集成主题系统
4. **样式定制**：支持深度定制主题样式和行为

## 性能优化

- 使用 React Context 避免不必要的重渲染
- CSS 变量更新只在主题切换时执行
- 主题配置对象使用 `as const` 确保类型推导
- localStorage 操作异步化，避免阻塞 UI