# 自动翻译脚本使用指南

本文档详细介绍了项目中的自动翻译脚本 `generate-translations.js` 的使用方法、配置选项和最佳实践。

## 📋 目录

- [功能概述](#功能概述)
- [安装依赖](#安装依赖)
- [基本使用](#基本使用)
- [配置选项](#配置选项)
- [性能优化](#性能优化)
- [缓存系统](#缓存系统)
- [增量更新](#增量更新)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## 🚀 功能概述

自动翻译脚本是一个高性能的国际化翻译工具，具有以下核心特性：

### ✨ 核心功能
- **🔄 并发翻译**: 使用 p-limit 控制并发数量，提升翻译效率
- **📦 批量处理**: 合并短文本进行批量翻译，减少API调用次数
- **💾 智能缓存**: MD5哈希缓存系统，避免重复翻译
- **⚡ 增量更新**: 只翻译新增或修改的内容，大幅提升性能
- **🔧 插值变量**: 完美支持 `{{variable}}` 格式的插值变量
- **🛡️ 错误重试**: 智能重试机制，提高翻译成功率
- **📊 性能监控**: 详细的执行时间和缓存统计

### 🎯 技术特性
- **ESM模块**: 使用现代ES模块语法
- **TypeScript友好**: 完整的类型支持
- **多语言支持**: 支持10+种主流语言
- **配置灵活**: 丰富的性能配置选项

## 📦 安装依赖

脚本依赖以下npm包，请确保已安装：

```bash
# 核心依赖
npm install google-translate-api-x p-limit

# 或使用 pnpm (推荐)
pnpm add google-translate-api-x p-limit

# 或使用 yarn
yarn add google-translate-api-x p-limit
```

### 依赖说明
- **google-translate-api-x**: Google翻译API客户端
- **p-limit**: 并发控制库，限制同时进行的翻译任务数量

## 🎮 基本使用

### 1. 直接运行

```bash
# 在项目根目录运行
node scripts/generate-translations.js

# 或使用 npm scripts (如果已配置)
npm run translate
```

### 2. 编程方式调用

```javascript
import { generateTranslations } from './scripts/generate-translations.js';

// 翻译指定语言
await generateTranslations(['en-US', 'ja-JP', 'ko-KR']);

// 翻译所有配置的语言
await generateTranslations();
```

### 3. 项目结构要求

```
project-root/
├── .env                    # 环境配置文件
├── src/
│   └── locales/
│       ├── zh-CN.json     # 源语言文件
│       ├── en-US.json     # 目标语言文件
│       └── ...
├── scripts/
│   ├── generate-translations.js  # 翻译脚本
│   └── scripts/
│       └── .translation-cache.json  # 缓存文件(自动生成)
└── package.json
```

## ⚙️ 配置选项

### 性能配置 (PERFORMANCE_CONFIG)

脚本提供了丰富的性能配置选项，位于文件顶部：

```javascript
const PERFORMANCE_CONFIG = {
  concurrency: 3,      // 并发翻译数量 (1-10)
  batchSize: 5,        // 批量翻译大小 (1-20)
  cacheEnabled: true,  // 启用缓存 (true/false)
  retryAttempts: 3,    // 重试次数 (1-5)
  retryDelay: 1000,    // 重试延迟(ms) (500-5000)
  apiDelay: 100        // API调用间隔(ms) (50-1000)
};
```

#### 配置说明

| 配置项 | 默认值 | 说明 | 推荐范围 |
|--------|--------|------|----------|
| `concurrency` | 3 | 同时进行的翻译任务数 | 1-10 |
| `batchSize` | 5 | 每批处理的文本数量 | 1-20 |
| `cacheEnabled` | true | 是否启用翻译缓存 | true/false |
| `retryAttempts` | 3 | 翻译失败时的重试次数 | 1-5 |
| `retryDelay` | 1000 | 重试间隔时间(毫秒) | 500-5000 |
| `apiDelay` | 100 | 批次间的延迟时间 | 50-1000 |

### 目标语言配置

在脚本顶部修改 `targetLanguages` 数组：

```javascript
const targetLanguages = [
  'en-US',    // 英语
  'ja-JP',    // 日语
  'ko-KR',    // 韩语
  'fr-FR',    // 法语
  'de-DE',    // 德语
  'es-ES',    // 西班牙语
  'it-IT',    // 意大利语
  'ru-RU',    // 俄语
  'pt-PT'     // 葡萄牙语
];
```

### 环境配置 (.env)

在项目根目录的 `.env` 文件中配置默认语言：

```env
# 默认源语言
VITE_DEFAULT_LANGUAGE=zh-CN
```

## 🚀 性能优化

### 1. 并发控制优化

```javascript
// 高性能配置 (适合网络条件好的环境)
const PERFORMANCE_CONFIG = {
  concurrency: 5,      // 提高并发数
  batchSize: 10,       // 增大批量大小
  apiDelay: 50         // 减少延迟
};

// 稳定性优先配置 (适合网络不稳定的环境)
const PERFORMANCE_CONFIG = {
  concurrency: 2,      // 降低并发数
  batchSize: 3,        // 减小批量大小
  apiDelay: 200,       // 增加延迟
  retryAttempts: 5     // 增加重试次数
};
```

### 2. 批量处理优化

脚本自动将短文本合并进行批量翻译，显著减少API调用次数：

```javascript
// 自动批量处理示例
// 输入: ["保存", "取消", "确定", "删除", "编辑"]
// 合并为: "保存 |SEPARATOR| 取消 |SEPARATOR| 确定 |SEPARATOR| 删除 |SEPARATOR| 编辑"
// 一次API调用完成5个文本的翻译
```

### 3. 性能监控

脚本提供详细的性能统计信息：

```bash
🚀 开始生成翻译文件...
⚙️  性能配置: 并发数=3, 批量大小=5
📝 发现 106 个待翻译文本
🔄 处理批次 1/22 (5 个文本)
✅ 翻译完成
💾 缓存已保存，共 105 条记录
🎉 所有翻译文件生成完成！耗时: 20.11s
📊 缓存统计: 105 条记录
```

## 💾 缓存系统

### 缓存机制

脚本使用MD5哈希缓存系统，避免重复翻译相同内容：

```javascript
// 缓存键生成
function getCacheKey(text, sourceLang, targetLang) {
  return crypto.createHash('md5')
    .update(`${text}|${sourceLang}|${targetLang}`)
    .digest('hex');
}
```

### 缓存文件

缓存数据存储在 `scripts/scripts/.translation-cache.json`：

```json
{
  "a1b2c3d4e5f6...": "Hello World",
  "f6e5d4c3b2a1...": "Welcome",
  "...": "..."
}
```

### 缓存管理

```bash
# 查看缓存统计
ls -la scripts/scripts/.translation-cache.json

# 清空缓存 (重新翻译所有内容)
rm scripts/scripts/.translation-cache.json

# 备份缓存
cp scripts/scripts/.translation-cache.json .translation-cache.backup.json
```

### 缓存优势

- **避免重复翻译**: 相同文本只翻译一次
- **跨项目复用**: 缓存可在不同项目间共享
- **离线工作**: 已缓存的内容无需网络连接
- **成本节约**: 减少API调用，降低翻译成本

## ⚡ 增量更新

### 工作原理

脚本自动检测源文件和目标文件的差异，只翻译新增或修改的内容：

```javascript
// 检测更新逻辑
function needsUpdate(defaultTranslations, targetLang) {
  // 1. 比较键的数量
  // 2. 检测新增的键
  // 3. 检测删除的键
  // 4. 返回更新状态
}
```

### 增量更新流程

1. **扫描源文件**: 收集所有翻译键
2. **对比目标文件**: 识别新增/删除的键
3. **提取新内容**: 只处理变更的部分
4. **合并结果**: 将新翻译合并到现有文件

### 使用示例

```bash
# 首次运行 - 完整翻译
📄 目标文件不存在，需要完整翻译: en-US
📝 发现 106 个待翻译文本

# 后续运行 - 增量更新
🔄 检测到变更: 新增 3 个，删除 0 个键
🔄 执行增量更新，翻译 3 个新键

# 无变更时
✅ en-US 翻译文件已是最新
```

## 🛡️ 错误处理

### 重试机制

脚本内置智能重试机制，自动处理网络错误和API限制：

```javascript
// 重试逻辑
async function translateSingle(text, sourceLang, targetLang, attempt = 1) {
  try {
    // 执行翻译
  } catch (error) {
    if (attempt < PERFORMANCE_CONFIG.retryAttempts) {
      // 指数退避重试
      await new Promise(resolve => 
        setTimeout(resolve, PERFORMANCE_CONFIG.retryDelay * attempt)
      );
      return translateSingle(text, sourceLang, targetLang, attempt + 1);
    }
    throw error;
  }
}
```

### 错误类型处理

| 错误类型 | 处理方式 | 说明 |
|----------|----------|------|
| 网络超时 | 自动重试 | 使用指数退避算法 |
| API限制 | 延迟重试 | 增加请求间隔 |
| 翻译失败 | 保留原文 | 确保不丢失内容 |
| 文件错误 | 抛出异常 | 需要手动处理 |

### 错误日志

```bash
⚠️  翻译失败，重试 1/3: 用户管理
⚠️  批量翻译失败，回退到单个翻译: Network timeout
❌ 翻译失败 dashboard.title: API rate limit exceeded
```

## 🎯 最佳实践

### 1. 性能调优

```javascript
// 根据网络环境调整配置

// 高速网络环境
const PERFORMANCE_CONFIG = {
  concurrency: 5,
  batchSize: 10,
  apiDelay: 50
};

// 一般网络环境 (推荐)
const PERFORMANCE_CONFIG = {
  concurrency: 3,
  batchSize: 5,
  apiDelay: 100
};

// 不稳定网络环境
const PERFORMANCE_CONFIG = {
  concurrency: 1,
  batchSize: 3,
  apiDelay: 300,
  retryAttempts: 5
};
```

### 2. 翻译质量优化

```json
// 源文件结构建议
{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认"
  },
  "user": {
    "profile": "个人资料",
    "settings": "设置"
  },
  "messages": {
    "welcome": "欢迎 {{name}}",
    "count": "您有 {{count}} 条消息"
  }
}
```

### 3. 插值变量处理

```javascript
// 正确的插值变量格式
"welcome": "欢迎 {{name}}"           // ✅ 正确
"count": "您有 {{count}} 条消息"     // ✅ 正确
"user_info": "用户: {{user.name}}"  // ✅ 支持嵌套

// 避免的格式
"welcome": "欢迎 {name}"            // ❌ 错误格式
"count": "您有 ${count} 条消息"      // ❌ 错误格式
```

### 4. 文件组织

```
src/locales/
├── zh-CN.json          # 源语言 (中文)
├── en-US.json          # 英语翻译
├── ja-JP.json          # 日语翻译
├── ko-KR.json          # 韩语翻译
└── ...

scripts/
├── generate-translations.js
└── scripts/
    └── .translation-cache.json  # 缓存文件
```

### 5. 版本控制

```gitignore
# .gitignore

# 缓存文件可选择性提交
scripts/scripts/.translation-cache.json

# 翻译文件建议提交
src/locales/*.json
```

## 🔧 故障排除

### 常见问题

#### 1. 网络连接问题

```bash
# 错误信息
❌ 翻译失败: Network timeout

# 解决方案
# 1. 检查网络连接
# 2. 降低并发数量
# 3. 增加重试次数和延迟
const PERFORMANCE_CONFIG = {
  concurrency: 1,
  retryAttempts: 5,
  retryDelay: 2000
};
```

#### 2. API限制问题

```bash
# 错误信息
❌ API rate limit exceeded

# 解决方案
# 1. 增加API调用间隔
# 2. 降低批量大小
const PERFORMANCE_CONFIG = {
  batchSize: 3,
  apiDelay: 500
};
```

#### 3. 文件权限问题

```bash
# 错误信息
❌ EACCES: permission denied

# 解决方案
sudo chmod 755 scripts/
sudo chmod 644 scripts/generate-translations.js
```

#### 4. 依赖缺失问题

```bash
# 错误信息
Error: Cannot find module 'google-translate-api-x'

# 解决方案
npm install google-translate-api-x p-limit
```

### 调试技巧

#### 1. 启用详细日志

```javascript
// 在脚本中添加调试信息
console.log('🔍 调试信息:', {
  text,
  sourceLang,
  targetLang,
  cacheKey
});
```

#### 2. 测试单个语言

```javascript
// 修改目标语言数组，只测试一种语言
const targetLanguages = ['en-US'];
```

#### 3. 清空缓存重试

```bash
# 删除缓存文件，重新翻译
rm scripts/scripts/.translation-cache.json
node scripts/generate-translations.js
```

### 性能监控

```bash
# 监控脚本执行
time node scripts/generate-translations.js

# 监控内存使用
node --max-old-space-size=4096 scripts/generate-translations.js
```

## 📊 性能基准

### 测试环境
- **文本数量**: 106个翻译项
- **目标语言**: en-US
- **网络环境**: 稳定宽带
- **硬件**: MacBook Pro M1

### 性能对比

| 配置 | 并发数 | 批量大小 | 执行时间 | API调用次数 |
|------|--------|----------|----------|-------------|
| 串行处理 | 1 | 1 | ~180s | 106次 |
| 默认配置 | 3 | 5 | ~20s | 22次 |
| 高性能配置 | 5 | 10 | ~15s | 11次 |

### 缓存效果

| 场景 | 缓存命中率 | 执行时间 | 说明 |
|------|------------|----------|------|
| 首次运行 | 0% | 20.11s | 全部翻译 |
| 无变更重运行 | 100% | 2.3s | 全部命中缓存 |
| 增量更新 | 95% | 3.8s | 只翻译新内容 |

## 🔄 更新日志

### v2.1.0 (最新)
- ✨ 新增并发翻译支持
- ✨ 实现智能缓存系统
- ✨ 添加批量翻译功能
- ✨ 支持增量更新
- 🐛 修复插值变量处理bug
- ⚡ 性能提升90%+

### v2.0.0
- 🔄 重构为ESM模块
- ✨ 添加TypeScript支持
- ✨ 新增错误重试机制
- 📊 添加性能监控

### v1.0.0
- 🎉 初始版本
- ✨ 基础翻译功能
- ✨ 插值变量支持

## 📞 技术支持

如果在使用过程中遇到问题，请：

1. 查看本文档的故障排除章节
2. 检查脚本的错误日志输出
3. 确认网络连接和依赖安装
4. 提交Issue并附上详细的错误信息

---

**注意**: 本脚本使用Google翻译API，请确保网络环境能够正常访问Google服务。在生产环境中使用时，建议配置适当的API密钥和访问限制。