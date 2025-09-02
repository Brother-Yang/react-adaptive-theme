import type { Plugin, ResolvedConfig } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';
// 兼容不同版本的@babel/traverse导入
const traverseAST = (traverse as unknown as { default?: typeof traverse }) .default || traverse;
import * as t from '@babel/types';

interface AutoI18nOptions {
  localesDir?: string;
  defaultLocale?: string;
  include?: string[];
  exclude?: string[];
  resolveAlias?: Record<string, string>;
}

interface KeyValuePair {
  key: string;
  value: string;
  file: string;
  line: number;
}

interface FileCache {
  content: string;
  mtime: number;
  size: number;
  contentHash: string;
  keyValuePairs: KeyValuePair[];
}

interface DuplicateKeyInfo {
  key: string;
  files: Array<{ file: string; line: number; value: string }>;
}

const DEFAULT_OPTIONS: Required<AutoI18nOptions> = {
  localesDir: 'src/locales',
  defaultLocale: 'zh-CN',
  include: ['**/*.{ts,tsx,js,jsx}'],
  exclude: ['node_modules/**', 'dist/**', '**/*.d.ts'],
  resolveAlias: {}
};

// 生成key的函数
function generateKey(value: string): string {
  // 检查是否包含中文字符
  const hasChinese = /[\u4e00-\u9fff]/.test(value);
  
  if (hasChinese) {
    // 中文文本：使用MD5 hash避免冲突，增加到12位提高安全性
    const hash = crypto.createHash('md5').update(value, 'utf8').digest('hex');
    return `auto.${hash.substring(0, 12)}`; // 取前12位，进一步降低冲突概率
  } else {
    // 英文文本：转换为驼峰格式，保持在一个层级
    const camelCase = value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // 移除特殊字符
      .split(/\s+/) // 按空格分割
      .filter(word => word.length > 0) // 过滤空字符串
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return `auto.${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
  }
}

// 解析文件中的t函数调用
function parseFile(filePath: string, content: string): KeyValuePair[] {
  const keyValuePairs: KeyValuePair[] = [];
  
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        'decorators-legacy',
        'classProperties',
        'objectRestSpread'
      ]
    });
    
    traverseAST(ast, {
      CallExpression(path: NodePath<CallExpression>) {
        const { node } = path;
        
        // 检查是否是tAuto函数调用
        if (
          t.isIdentifier(node.callee, { name: 'tAuto' }) &&
          node.arguments.length > 0 &&
          t.isStringLiteral(node.arguments[0])
        ) {
          // 检查第二个参数是否包含key选项
          let manualKey: string | null = null;
          if (node.arguments.length > 1 && t.isObjectExpression(node.arguments[1])) {
            const options = node.arguments[1];
            const keyProperty = options.properties.find(prop => 
              t.isObjectProperty(prop) && 
              t.isIdentifier(prop.key, { name: 'key' })
            );
            if (keyProperty && t.isObjectProperty(keyProperty) && t.isStringLiteral(keyProperty.value)) {
              manualKey = keyProperty.value.value;
            }
          }
          
          const value = node.arguments[0].value;
          const line = node.loc?.start.line || 0;
          
          // 如果有手动指定的key，使用手动key；否则自动生成key
          const key = manualKey || generateKey(value);
          
          keyValuePairs.push({
            key,
            value,
            file: filePath,
            line
          });
        }
      }
    });
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
  }
  
  return keyValuePairs;
}

// 深度合并对象，保留已有值
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
          result[key] = deepMerge(result[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
        } else {
          result[key] = source[key];
        }
      } else {
        // 只有当目标值不存在或为空时才覆盖
        if (result[key] === undefined || result[key] === null || result[key] === '') {
          result[key] = source[key];
        }
      }
    }
  }
  
  return result;
}

// 更新JSON文件（支持深度合并）
function updateLocaleFile(localeFilePath: string, keyValuePairs: KeyValuePair[]) {
  let localeData: Record<string, unknown> = {};
  
  // 读取现有的locale文件
  if (fs.existsSync(localeFilePath)) {
    try {
      const content = fs.readFileSync(localeFilePath, 'utf-8');
      localeData = JSON.parse(content);
    } catch (error) {
      console.warn(`Failed to parse ${localeFilePath}:`, error);
    }
  }
  
  // 构建新的数据结构
  const newData: Record<string, unknown> = {};
  let hasChanges = false;
  
  for (const { key, value } of keyValuePairs) {
    const existingValue = getNestedValue(localeData, key);
    if (!existingValue || existingValue === '') {
       setNestedValue(newData, key, value);
       hasChanges = true;
       console.log(`Added key: ${key} = ${value}`);
     } else {
       console.log(`Skipped existing key: ${key} (current: ${existingValue})`);
     }
  }
  
  // 深度合并，保留已有翻译
  if (hasChanges) {
    const mergedData = deepMerge(localeData, newData);
    
    const dir = path.dirname(localeFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(localeFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
    console.log(`Updated ${localeFilePath}`);
  }
}

// 获取嵌套对象的值
function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.');
  let current: unknown = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && current !== null && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  
  return current;
}

// 设置嵌套对象的值
function setNestedValue(obj: Record<string, unknown>, key: string, value: unknown): void {
  const keys = key.split('.');
  let current: Record<string, unknown> = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
      current[k] = {};
    }
    current = current[k] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
}

export function autoI18nPlugin(options: AutoI18nOptions = {}): Plugin {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let root = '';
  let resolvedConfig: ResolvedConfig | null = null;
  // 全局key映射，在编译时收集所有key
  const globalKeyMapping = new Map<string, string>();
  // 文件缓存，避免重复解析
  const fileCache = new Map<string, FileCache>();
  // 重复key检测
  const duplicateKeys = new Map<string, DuplicateKeyInfo>();
  // 待写入队列，用于批量I/O操作
  const pendingWrites = new Map<string, KeyValuePair[]>();
  let writeTimer: NodeJS.Timeout | null = null;
  
  // 批量写入队列处理
  function flushPendingWrites() {
    if (pendingWrites.size === 0) return;
    
    console.log(`🔄 Flushing ${pendingWrites.size} pending locale updates...`);
    
    pendingWrites.forEach((keyValuePairs, localeFilePath) => {
      updateLocaleFile(localeFilePath, keyValuePairs);
    });
    
    pendingWrites.clear();
    console.log('✅ All locale files updated');
  }
   
  // 添加到写入队列
  function queueLocaleUpdates(localeFilePath: string, keyValuePairs: KeyValuePair[]) {
    // 合并到待写入队列
    const existing = pendingWrites.get(localeFilePath) || [];
    pendingWrites.set(localeFilePath, [...existing, ...keyValuePairs]);
    
    // 防抖写入，避免频繁I/O
    if (writeTimer) {
      clearTimeout(writeTimer);
    }
    writeTimer = setTimeout(flushPendingWrites, 500); // 500ms防抖
  }
  
  // 解析文件中的t函数调用（带缓存）
  function parseFileWithCache(filePath: string, content: string, mtime: number, size: number): KeyValuePair[] {
    // 生成内容哈希用于更可靠的缓存验证
    const contentHash = crypto.createHash('md5').update(content, 'utf8').digest('hex');
    
    // 检查缓存，使用多重验证：内容、修改时间、文件大小、内容哈希
    const cached = fileCache.get(filePath);
    if (cached && 
        cached.content === content && 
        cached.mtime === mtime && 
        cached.size === size &&
        cached.contentHash === contentHash) {
      return cached.keyValuePairs;
    }
    
    // 解析文件
    const keyValuePairs = parseFile(filePath, content);
    
    // 更新缓存
    fileCache.set(filePath, {
      content,
      mtime,
      size,
      contentHash,
      keyValuePairs
    });
    
    return keyValuePairs;
  }
  
  // 扫描所有文件收集key映射
  function scanAllFiles() {
    function scanDirectory(dir: string): string[] {
      const files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
            files.push(...scanDirectory(fullPath));
          }
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
          files.push(fullPath);
        }
      }
      return files;
    }
    
    const files = scanDirectory(root);
    files.forEach((filePath: string) => {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const keyValuePairs = parseFileWithCache(filePath, content, stats.mtime.getTime(), stats.size);
        keyValuePairs.forEach(({ key, value, file, line }) => {
          globalKeyMapping.set(value, key);
          
          // 检测重复key
          if (duplicateKeys.has(key)) {
            const existing = duplicateKeys.get(key)!;
            existing.files.push({ file, line, value });
          } else {
            duplicateKeys.set(key, {
              key,
              files: [{ file, line, value }]
            });
          }
        });
      }
    });
    
    // 输出重复key警告
    duplicateKeys.forEach((info) => {
      if (info.files.length > 1) {
        console.warn(`\n⚠️  重复key检测: "${info.key}"`);
        info.files.forEach(({ file, line, value }) => {
          console.warn(`   - ${path.relative(root, file)}:${line} -> "${value}"`);
        });
      }
    });
  }
  
  // 解析路径，支持alias和相对路径
  function resolvePath(inputPath: string): string {
    // 处理绝对路径
    if (path.isAbsolute(inputPath)) {
      return inputPath;
    }
    
    // 处理alias
    if (resolvedConfig && resolvedConfig.resolve && resolvedConfig.resolve.alias) {
      const aliases = resolvedConfig.resolve.alias;
      for (const [alias, aliasPath] of Object.entries(aliases)) {
        if (inputPath.startsWith(alias)) {
          const resolvedAliasPath = path.isAbsolute(aliasPath as string) 
            ? aliasPath as string 
            : path.resolve(root, aliasPath as string);
          return inputPath.replace(alias, resolvedAliasPath);
        }
      }
    }
    
    // 处理自定义alias
    for (const [alias, aliasPath] of Object.entries(opts.resolveAlias)) {
      if (inputPath.startsWith(alias)) {
        const resolvedAliasPath = path.isAbsolute(aliasPath) 
          ? aliasPath 
          : path.resolve(root, aliasPath);
        return inputPath.replace(alias, resolvedAliasPath);
      }
    }
    
    // 处理相对路径
    return path.resolve(root, inputPath);
  }
  
  return {
    name: 'vite-plugin-auto-i18n',
    configResolved(config) {
      root = config.root;
      resolvedConfig = config;
      
      // 解析localesDir路径
      const resolvedLocalesDir = resolvePath(opts.localesDir);
      opts.localesDir = path.relative(root, resolvedLocalesDir) || opts.localesDir;
      
      console.log(`📁 Locales directory resolved to: ${opts.localesDir}`);
      
      // 确保locale目录和默认locale文件存在
      const localesDirPath = path.resolve(root, opts.localesDir);
      const defaultLocaleFilePath = path.resolve(localesDirPath, `${opts.defaultLocale}.json`);
      
      // 创建locales目录
      if (!fs.existsSync(localesDirPath)) {
        fs.mkdirSync(localesDirPath, { recursive: true });
        console.log(`📁 Created locales directory: ${opts.localesDir}`);
      }
      
      // 创建默认locale文件（如果不存在）
      if (!fs.existsSync(defaultLocaleFilePath)) {
        fs.writeFileSync(defaultLocaleFilePath, JSON.stringify({}, null, 2), 'utf-8');
        console.log(`📄 Created default locale file: ${opts.defaultLocale}.json`);
      }
    },
    
    buildStart() {
      // 在开发模式下，扫描所有文件并更新locale文件
      if (process.env.NODE_ENV === 'development') {
        this.addWatchFile(path.resolve(root, opts.localesDir));
        // 初始扫描所有文件，收集key映射
        scanAllFiles();
      }
    },
    
    generateBundle() {
      // 在构建阶段批量写入所有待处理的locale更新
      flushPendingWrites();
    },
    
    handleHotUpdate({ file, server }) {
      // 只处理TypeScript/JavaScript文件
      if (!/\.(ts|tsx|js|jsx)$/.test(file)) {
        return;
      }
      
      // 读取文件内容、修改时间和文件大小
      const stats = fs.statSync(file);
      const content = fs.readFileSync(file, 'utf-8');
      
      // 解析文件中的t函数调用（使用缓存）
      const keyValuePairs = parseFileWithCache(file, content, stats.mtime.getTime(), stats.size);
      
      if (keyValuePairs.length > 0) {
        // 更新全局key映射
        keyValuePairs.forEach(({ key, value }) => {
          globalKeyMapping.set(value, key);
        });
        
        // 添加到写入队列，减少I/O操作
        const localeFilePath = path.resolve(root, opts.localesDir, `${opts.defaultLocale}.json`);
        queueLocaleUpdates(localeFilePath, keyValuePairs);
        
        // 通知客户端刷新
        server.ws.send({
          type: 'full-reload'
        });
      }
    },
    
    configureServer(server) {
      // 注入客户端脚本，提供API给useTranslation使用
      server.middlewares.use('/__auto_i18n_api/add-key', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', () => {
            try {
              const { key, value } = JSON.parse(body);
              const keyValuePairs = [{ key, value, file: 'runtime', line: 0 }];
              const localeFilePath = path.resolve(root, opts.localesDir, `${opts.defaultLocale}.json`);
              updateLocaleFile(localeFilePath, keyValuePairs);
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else {
          next();
        }
      });
    },
    
    transformIndexHtml(html) {
      // 将key映射转换为普通对象
      const keyMappingObject: Record<string, string> = {};
      globalKeyMapping.forEach((key, value) => {
        keyMappingObject[value] = key;
      });
      
      // 构建客户端脚本
      const clientScript = `
  <script>
    window.__AUTO_I18N_PLUGIN__ = {
      keyMapping: ${JSON.stringify(keyMappingObject)},
      addedKeys: new Set(), // 缓存已添加的key，避免重复请求
      addKey: function(key, value) {
        var keyValuePair = key + ':' + value;
        if (this.addedKeys.has(keyValuePair)) {
          return; // 已经添加过，跳过请求
        }
        
        // 检查key是否已经存在于i18n实例中
        var i18n = window.i18n || 
                   (window.i18next && window.i18next.default) || 
                   (window.i18next) ||
                   (window.reactI18next && window.reactI18next.i18n);
        
        if (i18n && i18n.t) {
          var existingTranslation = i18n.t(key, { defaultValue: null });
          if (existingTranslation !== null && existingTranslation !== key) {
            // key已存在且有翻译，添加到缓存但不发送请求
            this.addedKeys.add(keyValuePair);
            return;
          }
        }
        
        this.addedKeys.add(keyValuePair);
        fetch('/__auto_i18n_api/add-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, value })
        }).catch(console.error);
      },
      getKey: function(value) {
        return this.keyMapping[value];
      },
      t: function(value, options) {
        // 尝试多种方式获取i18n实例
        var i18n = window.i18n || 
                   (window.i18next && window.i18next.default) || 
                   (window.i18next) ||
                   (window.reactI18next && window.reactI18next.i18n);
        
        // 如果还是找不到，尝试从全局变量中获取
        if (!i18n && typeof window !== 'undefined') {
          // 检查是否有其他可能的i18n实例
          var possibleI18n = Object.keys(window).find(function(key) {
            return window[key] && typeof window[key].t === 'function' && typeof window[key].language === 'string';
          });
          if (possibleI18n) {
            i18n = window[possibleI18n];
          }
        }
        
        if (!i18n || !i18n.t) {
          console.warn('i18n instance not found, returning original value');
          return value;
        }
        
        if (options && options.key) {
          this.addKey(options.key, value);
          var interpolationParams = {};
          if (options) {
            Object.keys(options).forEach(function(k) {
              if (k !== 'key') {
                interpolationParams[k] = options[k];
              }
            });
          }
          var hasInterpolation = Object.keys(interpolationParams).length > 0;
          var translation = i18n.t(options.key, Object.assign({ defaultValue: value }, hasInterpolation ? interpolationParams : {}));
          return translation === options.key ? value : translation;
        }
        
        var key = this.getKey(value);
        if (!key) {
          console.warn('Key not found for value: ' + value + '. This might indicate the plugin has not scanned this file yet.');
          return value;
        }
        
        var interpolationParams = {};
        if (options) {
          Object.keys(options).forEach(function(k) {
            if (k !== 'key') {
              interpolationParams[k] = options[k];
            }
          });
        }
        
        var hasInterpolation = Object.keys(interpolationParams).length > 0;
        var translation = i18n.t(key, Object.assign({ defaultValue: value }, hasInterpolation ? interpolationParams : {}));
        return translation === key ? value : translation;
      }
    };
  </script>`;
      
      // 注入客户端脚本
      return html.replace('<head>', '<head>' + clientScript);
    }
  };
}

export default autoI18nPlugin;