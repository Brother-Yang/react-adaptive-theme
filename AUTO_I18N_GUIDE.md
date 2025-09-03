# 自动国际化系统使用指南

## 概述

本项目实现了一个高性能的自动国际化系统，采用**编译时key生成**架构，能够自动为文本生成翻译key并保存到JSON文件中，同时支持手动指定key和插值变量功能。系统通过Vite插件在构建时预生成所有翻译key，显著提升运行时性能。

## 核心特性

- 🚀 **编译时key生成**：构建时预生成所有翻译key，运行时零开销
- ⚡ **高性能架构**：移除运行时key生成逻辑，大幅提升性能
- 🎯 **智能key处理**：自动生成key或手动指定key，两种方式都会添加到JSON文件
- 🔄 **插值变量**：完全兼容react-i18next的插值语法
- 📝 **实时更新**：开发时自动更新翻译文件
- 🌍 **多语言支持**：支持中英文等多种语言
- 🔧 **零配置**：开箱即用，无需复杂配置
- 🎨 **智能优化**：自动去重和优化翻译key映射

## 安装与配置

### 1. 项目结构

```
src/
├── hooks/
│   └── useAutoTranslation.ts    # 自动翻译hook
├── locales/
│   ├── zh-CN.json               # 中文翻译文件
│   └── en-US.json               # 英文翻译文件
├── config/
│   └── i18n.ts                  # i18next配置文件
└── components/
    └── TestTranslation/         # 使用示例
plugins/
└── vite-plugin-auto-i18n.ts    # 自动国际化插件
```

### 2. Vite配置

确保在 `vite.config.ts` 中启用了自动国际化插件：

```typescript
import { defineConfig } from 'vite'
import autoI18n from './plugins/vite-plugin-auto-i18n'

export default defineConfig({
  plugins: [
    // 自动国际化插件
    autoI18n(),
  ],
})
```

## API 使用

### useAutoTranslation Hook

```typescript
import { useAutoTranslation } from '../hooks/useAutoTranslation';

const { tAuto, locale, i18n } = useAutoTranslation();
```

#### 返回值

- `tAuto`: 自动翻译函数，支持自动生成key和手动指定key
- `locale`: 当前语言
- `i18n`: react-i18next实例

## 基本使用

### 1. 自动生成key

```typescript
// 中文文本 - 生成hash key
tAuto('欢迎使用自动国际化系统')  // 生成: auto.123456789

// 英文文本 - 生成驼峰key
tAuto('Hello World')  // 生成: auto.HelloWorld
tAuto('This is a test')  // 生成: auto.ThisIsATest
```

### 2. 手动指定key

```typescript
// 使用自定义key - 插件会将手动key添加到JSON文件
tAuto('用户登录成功', { key: 'user.login.success' })
tAuto('Welcome back', { key: 'user.welcome' })
tAuto('测试自动国际化', { key: 'testAutoLocal' })
```

### 3. 直接使用已存在的key

```typescript
// 对于已经存在于翻译文件中的key，可以直接使用手动key方式
tAuto('确认', { key: 'common.confirm' })
tAuto('取消', { key: 'common.cancel' })

## 插值变量

### 基本语法

使用 `{{变量名}}` 格式在文本中定义占位符：

```typescript
// 基本插值
tAuto('欢迎 {{name}}', { name: '张三' })
// 输出: 欢迎 张三

// 多个变量
tAuto('欢迎 {{name}}，今天是 {{date}}', { 
  name: '张三', 
  date: '2024年1月15日' 
})
// 输出: 欢迎 张三，今天是 2024年1月15日
```

### 数字插值

```typescript
tAuto('您有 {{count}} 条未读消息', { count: 5 })
// 输出: 您有 5 条未读消息

tAuto('Hello {{name}}, you have {{count}} new messages', { 
  name: 'John', 
  count: 3 
})
// 输出: Hello John, you have 3 new messages
```

### 手动key + 插值

```typescript
tAuto('用户 {{username}} 登录成功', { 
  key: 'user.login.success', 
  username: '李四' 
})
// 插件会将key 'user.login.success' 和值 '用户 {{username}} 登录成功' 添加到JSON文件
// 输出: 用户 李四 登录成功
```

### 支持的数据类型

- `string`: 字符串
- `number`: 数字
- `boolean`: 布尔值

```typescript
tAuto('状态: {{status}}, 数量: {{count}}, 启用: {{enabled}}', {
  status: '正常',
  count: 100,
  enabled: true
})
```

## 完整示例

```typescript
import React from 'react';
import { useAutoTranslation } from '../hooks/useAutoTranslation';

const MyComponent: React.FC = () => {
  const { tAuto, locale } = useAutoTranslation();
  const userName = '张三';
  const messageCount = 5;

  return (
    <div>
      {/* 当前语言 */}
      <p>{tAuto('当前语言')}: {locale}</p>
      
      {/* 自动生成key */}
      <h1>{tAuto('欢迎使用系统')}</h1>
      
      {/* 手动指定key */}
      <p>{tAuto('系统运行正常', { key: 'system.status.ok' })}</p>
      
      {/* 插值变量 */}
      <p>{tAuto('欢迎 {{name}}', { name: userName })}</p>
      <p>{tAuto('您有 {{count}} 条消息', { count: messageCount })}</p>
      
      {/* 手动key + 插值 */}
      <p>{tAuto('用户 {{user}} 在线', { 
        key: 'user.online.status', 
        user: userName 
      })}</p>
      
      {/* 使用手动key方式访问已存在的翻译 */}
      <button>{tAuto('保存', { key: 'common.save' })}</button>
      <button>{tAuto('取消', { key: 'common.cancel' })}</button>
    </div>
  );
};
```

## Key生成和处理规则

### 自动生成key（无手动key时）

#### 中文文本
- 生成格式：`auto.{hash}`
- 示例：`auto.123456789abc`
- 使用MD5 hash算法，取前12位确保唯一性和安全性

#### 英文文本
- 生成格式：`auto.{CamelCase}`
- 示例：`auto.HelloWorld`、`auto.ThisIsATest`
- 转换为驼峰命名，首字母大写
- **长度优化**：当驼峰命名超过30个字符时，自动截取前30个字符并添加12位hash值，确保key的可读性和唯一性

### 手动指定key
- 插件会将手动指定的key和对应的文本值添加到JSON翻译文件
- 支持嵌套结构：`user.login.success`
- 优先级：手动key > 自动生成key
- 示例：`tAuto('你好', {key: 'greeting.hello'})` 会在JSON中创建 `"greeting": {"hello": "你好"}`

## 翻译文件结构

### zh-CN.json（实际项目示例）
```json
{
  "auto": {
    "f19cc4345b6f": "切换语言",
    "3fa8b34a2744": "仪表盘",
    "7d94de1cdba7": "用户管理",
    "6b045a518d90": "用户列表",
    "3f856ec241d6": "角色管理",
    "e69c654eec1a": "权限设置",
    "ff4fce81b636": "切换到浅色主题",
    "c7163389115c": "切换到深色主题",
    "18d1485cc24c": "深色模式",
    "8755e992302b": "浅色模式"
  },
  "user": {
    "login": {
      "success": "用户登录成功"
    }
  },
  "common": {
    "save": "保存",
    "cancel": "取消"
  }
}
```

### en-US.json（实际项目示例）
```json
{
  "auto": {
    "f19cc4345b6f": "Switch language",
    "3fa8b34a2744": "Dashboard",
    "7d94de1cdba7": "User Management",
    "6b045a518d90": "User List",
    "3f856ec241d6": "Role Management",
    "e69c654eec1a": "Permission settings",
    "ff4fce81b636": "Switch to light theme",
    "c7163389115c": "Switch to dark theme",
    "18d1485cc24c": "Dark Mode",
    "8755e992302b": "Light-colored mode"
  },
  "user": {
    "login": {
      "success": "User login successful"
    }
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

## 最佳实践

### 1. 命名规范

```typescript
// ✅ 推荐：使用有意义的手动key
tAuto('用户登录', { key: 'user.login' })
tAuto('保存成功', { key: 'message.save.success' })

// ❌ 避免：无意义的key名称
tAuto('用户登录', { key: 'a.b.c' })
```

### 2. 插值变量

```typescript
// ✅ 推荐：清晰的变量名
tAuto('欢迎 {{userName}}，您有 {{messageCount}} 条消息', {
  userName: '张三',
  messageCount: 5
})

// ❌ 避免：模糊的变量名
tAuto('欢迎 {{a}}，您有 {{b}} 条消息', { a: '张三', b: 5 })
```

### 3. 文本组织

```typescript
// ✅ 推荐：按功能模块组织
tAuto('登录', { key: 'auth.login' })
tAuto('注册', { key: 'auth.register' })
tAuto('用户信息', { key: 'profile.info' })

// ✅ 推荐：通用文本使用common前缀
tAuto('确认', { key: 'common.confirm' })
tAuto('取消', { key: 'common.cancel' })
```

## 系统架构

### 编译时 vs 运行时

本系统采用**编译时key生成**架构，相比传统的运行时生成方式具有显著优势：

#### 编译时架构（当前）
- ✅ **构建时扫描**：Vite插件在构建时扫描所有源码文件
- ✅ **预生成映射**：提前生成完整的key-value映射表
- ✅ **客户端注入**：通过HTML转换将映射表注入到客户端
- ✅ **零运行时开销**：hook直接查询预生成的映射表
- ✅ **一致性保证**：所有key在构建时统一生成，避免运行时差异

#### 运行时架构（已废弃）
- ❌ **动态生成**：每次调用时动态生成key
- ❌ **性能开销**：频繁的字符串处理和hash计算
- ❌ **重复计算**：相同文本多次生成相同key
- ❌ **状态管理**：需要维护复杂的运行时状态

### 技术实现细节

#### 1. 构建时扫描与key生成
- **AST解析**：使用 `@babel/parser` 和 `@babel/traverse` 精确解析源码
- **函数调用识别**：自动识别 `tAuto()` 函数调用
- **智能key生成**：
  - 中文文本：MD5 hash前12位（如：`f19cc4345b6f`）
  - 英文文本：驼峰命名转换（如：`HelloWorld`）
  - 长文本优化：超过30字符自动截取+hash后缀

#### 2. 客户端注入机制
- **HTML转换**：通过 `transformIndexHtml` 钩子注入客户端脚本
- **全局对象**：创建 `window.__AUTO_I18N_PLUGIN__` 全局对象
- **key映射表**：将构建时生成的key映射注入到客户端
- **i18n实例检测**：智能检测多种i18n实例挂载方式

#### 3. 运行时优化
- **零计算开销**：直接查询预生成的key映射表
- **缓存机制**：避免重复的key添加请求
- **fallback处理**：插件不可用时优雅降级
- **类型安全**：完整的TypeScript类型定义

### 性能优化

1. **构建时优化**：所有key生成工作在构建时完成
2. **内存优化**：移除运行时Map和Set数据结构
3. **查询优化**：O(1)时间复杂度的key查询
4. **包体积优化**：减少运行时代码体积
5. **并发处理**：构建时支持并发文件处理
6. **增量更新**：只处理变更的文件

## 注意事项

1. **开发环境**：插件仅在开发环境下自动生成翻译文件
2. **文件编码**：确保翻译文件使用UTF-8编码
3. **key冲突**：避免手动key与自动生成key冲突
4. **构建依赖**：翻译key依赖构建过程，确保构建成功
5. **版本控制**：翻译文件应纳入版本控制
6. **缓存清理**：修改源码后需要重新构建以更新key映射

## 故障排除

### 翻译不生效
1. 检查Vite插件是否正确配置
2. 确认翻译文件路径正确
3. 检查浏览器控制台是否有错误

### Key未自动生成
1. 确认使用的是 `tAuto` 函数
2. 检查开发服务器是否正常运行
3. 查看终端是否有插件错误信息

### 插值变量不工作
1. 确认使用 `{{变量名}}` 格式
2. 检查变量名是否正确传递
3. 确认变量值类型正确

## 性能最佳实践

### 1. 合理使用自动key
```typescript
// ✅ 推荐：短文本使用自动key
tAuto('保存')
tAuto('取消')

// ✅ 推荐：长文本或重要文本使用手动key
tAuto('用户数据已成功保存到服务器', { key: 'user.data.save.success' })
```

### 2. 避免动态文本
```typescript
// ❌ 避免：动态拼接的文本无法在构建时识别
const dynamicText = `欢迎 ${userName}`
tAuto(dynamicText) // 无法预生成key

// ✅ 推荐：使用插值变量
tAuto('欢迎 {{name}}', { name: userName })
```

### 3. 模块化组织
```typescript
// ✅ 推荐：按模块组织key
tAuto('登录', { key: 'auth.login' })
tAuto('注册', { key: 'auth.register' })
tAuto('忘记密码', { key: 'auth.forgot.password' })
```

## 更新日志

- **v3.0.0** (当前版本): 
  - 🔄 **架构重构**: 完全移除 `tWithKey` 函数，统一使用 `tAuto` 函数
  - 🚀 **客户端注入**: 实现完整的客户端key映射注入机制
  - 🎯 **智能检测**: 支持多种i18n实例挂载方式的自动检测
  - 💾 **缓存优化**: 添加客户端key缓存，避免重复请求
  - 🛡️ **错误处理**: 完善的fallback机制和错误处理
  - 📦 **类型安全**: 完整的TypeScript类型定义
- **v2.1.0**: 优化英文key生成逻辑，支持长文本自动截取和hash后缀
- **v2.0.0**: 重构为编译时key生成架构，大幅提升性能
- **v1.2.0**: 添加插值变量支持
- **v1.1.0**: 支持手动指定key
- **v1.0.0**: 基础自动翻译功能

---

更多问题请参考项目文档或提交Issue。