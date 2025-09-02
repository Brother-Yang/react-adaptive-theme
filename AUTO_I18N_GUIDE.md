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
└── components/
    └── TestTranslation/         # 使用示例
plugins/
└── vite-plugin-auto-i18n.ts    # Vite插件
```

### 2. Vite配置

确保在 `vite.config.ts` 中启用了自动国际化插件：

```typescript
import { defineConfig } from 'vite'
import autoI18n from './plugins/vite-plugin-auto-i18n'

export default defineConfig({
  plugins: [
    // 其他插件...
    autoI18n(),
  ],
})
```

## API 使用

### useAutoTranslation Hook

```typescript
import { useAutoTranslation } from '../hooks/useAutoTranslation';

const { tAuto, tWithKey, locale, i18n } = useAutoTranslation();
```

#### 返回值

- `tAuto`: 自动翻译函数
- `tWithKey`: 手动key翻译函数
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

### 3. 使用tWithKey

```typescript
// 直接使用已存在的key
tWithKey('common.confirm', '确认')
tWithKey('common.cancel', '取消')
```

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
  const { tAuto, tWithKey, locale } = useAutoTranslation();
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
      
      {/* 使用tWithKey */}
      <button>{tWithKey('common.save', '保存')}</button>
      <button>{tWithKey('common.cancel', '取消')}</button>
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

### zh-CN.json
```json
{
  "auto": {
    "123456789": "欢迎使用系统",
    "HelloWorld": "Hello World",
    "ThisIsATest": "This is a test"
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

### en-US.json
```json
{
  "auto": {
    "123456789": "Welcome to the system",
    "HelloWorld": "Hello World",
    "ThisIsATest": "This is a test"
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

### 性能优化

1. **构建时优化**：所有key生成工作在构建时完成
2. **内存优化**：移除运行时Map和Set数据结构
3. **查询优化**：O(1)时间复杂度的key查询
4. **包体积优化**：减少运行时代码体积

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

- **v2.1.0**: 优化英文key生成逻辑，支持长文本自动截取和hash后缀
- **v2.0.0**: 重构为编译时key生成架构，大幅提升性能
- **v1.2.0**: 添加插值变量支持
- **v1.1.0**: 支持手动指定key
- **v1.0.0**: 基础自动翻译功能

---

更多问题请参考项目文档或提交Issue。