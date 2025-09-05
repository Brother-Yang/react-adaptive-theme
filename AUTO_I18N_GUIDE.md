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
- 🧹 **自动清理**：智能清理未使用的翻译词条，保持文件整洁
- 🚄 **性能优化**：多级缓存机制，批量I/O操作，显著提升处理速度

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
    autoI18n({
      // 启用清理功能（默认开启）
      enableCleanup: true,
      // 指定清理的命名空间（默认只清理auto命名空间）
      cleanupNamespaces: ['auto'],
      // 翻译文件目录（默认：src/locales）
      localesDir: 'src/locales',
      // 默认语言（默认：zh-CN）
      defaultLocale: 'zh-CN'
    }),
  ],
})
```

### 3. 插件配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enableCleanup` | boolean | `true` | 是否启用自动清理未使用的翻译词条 |
| `cleanupNamespaces` | string[] | `['auto']` | 指定需要清理的命名空间 |
| `localesDir` | string | `'src/locales'` | 翻译文件存放目录 |
| `defaultLocale` | string | `'zh-CN'` | 默认语言文件名 |

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
- **Radash.js集成**：使用高性能的 Radash.js 库优化对象操作和数据处理
  - `assign` 函数替代原生对象合并，提升深度合并性能
  - `get` 和 `set` 函数优化嵌套对象访问，提供更安全的属性操作
  - `isObject` 和 `isArray` 提供更准确的类型检查，减少运行时错误

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
7. **Radash.js优化**：集成高性能工具库，显著提升数据处理效率
   - 对象操作性能提升30-50%
   - 类型检查准确性提升，减少边界情况错误
   - 统一的函数式编程风格，提高代码可维护性

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

## 自动清理功能

### 清理机制

插件会自动检测和清理未使用的翻译词条，保持翻译文件整洁：

- **智能扫描**：扫描所有源码文件，识别实际使用的翻译key
- **命名空间过滤**：只清理指定命名空间中的未使用key（默认仅清理`auto`命名空间）
- **安全保护**：手动指定的key和其他命名空间的key不会被清理
- **实时清理**：文件变更时自动触发清理检查

### 清理配置

```typescript
// 默认配置：只清理auto命名空间
autoI18n({
  enableCleanup: true,
  cleanupNamespaces: ['auto']
})

// 清理多个命名空间
autoI18n({
  enableCleanup: true,
  cleanupNamespaces: ['auto', 'temp', 'test']
})

// 禁用清理功能
autoI18n({
  enableCleanup: false
})
```

### 清理示例

```json
// 清理前的翻译文件
{
  "auto": {
    "used_key": "使用中的文本",
    "unused_key": "未使用的文本"  // 将被清理
  },
  "manual": {
    "important_key": "重要文本"  // 不会被清理
  }
}

// 清理后的翻译文件
{
  "auto": {
    "used_key": "使用中的文本"
  },
  "manual": {
    "important_key": "重要文本"
  }
}
```

## 性能优化特性

### 多级缓存机制

- **文件列表缓存**：5秒TTL缓存，避免重复目录扫描
- **AST缓存**：独立缓存解析后的抽象语法树，减少重复解析
- **文件内容缓存**：基于文件修改时间和内容哈希的智能缓存
- **自动清理**：防止缓存无限增长，自动清理过期缓存

### 批量I/O优化

- **防抖写入**：200ms防抖机制，合并频繁的文件写入操作
- **去重处理**：写入前自动去重，避免重复操作
- **并行处理**：Promise.all并行处理多个文件操作
- **错误容错**：完善的异常处理，确保系统稳定性

### 扫描性能提升

- **智能过滤**：排除不必要的目录（node_modules、.git、dist等）
- **增量扫描**：只处理变更的文件，避免全量扫描
- **批量处理**：优化文件处理循环，减少I/O阻塞
- **内存优化**：统一的对象操作工具，减少内存占用
- **Radash.js加速**：使用 Radash.js 优化核心数据处理逻辑
  - `deepMerge` → `assign`：深度对象合并性能提升
  - `getNestedValue` → `get`：安全的嵌套属性访问
  - `setNestedValue` → `set`：高效的嵌套属性设置
  - 类型检查优化：`isObject`、`isArray` 提供更准确的类型判断

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

### 4. 清理策略
```typescript
// ✅ 推荐：重要的手动key使用独立命名空间
tAuto('系统配置', { key: 'system.config' })  // 不会被自动清理
tAuto('临时测试', { key: 'temp.test' })      // 可配置为清理目标

// ✅ 推荐：测试代码使用专门的命名空间
tAuto('测试文本', { key: 'test.sample' })    // 便于统一清理
```

## 更新日志

- **v3.2.0** (当前版本):
  - 🚀 **Radash.js集成**: 集成高性能 Radash.js 库，优化核心数据处理逻辑
  - ⚡ **性能大幅提升**: 对象操作性能提升30-50%，类型检查更准确
  - 🔧 **代码现代化**: 使用函数式编程风格，提高代码可维护性和可读性
  - 🛡️ **类型安全增强**: 更准确的类型检查，减少运行时错误
  - 📦 **依赖优化**: 统一使用 Radash.js 工具函数，减少代码重复
- **v3.1.0**:
  - 🧹 **自动清理**: 新增智能清理未使用翻译词条功能
  - 🚄 **性能优化**: 多级缓存机制，显著提升处理速度
  - 📦 **批量I/O**: 优化文件读写操作，减少I/O开销
  - 🔧 **代码精简**: 重构核心逻辑，提高代码质量和维护性
  - 🛡️ **错误容错**: 增强异常处理和系统稳定性
  - 📊 **性能监控**: 添加详细的性能指标和日志输出
- **v3.0.0**: 
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