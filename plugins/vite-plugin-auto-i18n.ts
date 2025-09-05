import type { Plugin, ResolvedConfig } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';
// 兼容不同版本的@babel/traverse导入
const traverseAST = (traverse as unknown as { default?: typeof traverse }).default || traverse;
import * as t from '@babel/types';

interface AutoI18nOptions {
  localesDir?: string;
  defaultLocale?: string;
  include?: string[];
  exclude?: string[];
  resolveAlias?: Record<string, string>;
  enableCleanup?: boolean; // 是否启用清理未使用的key
  cleanupNamespaces?: string[]; // 指定要清理的命名空间，默认只清理 'auto' 命名空间
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
  resolveAlias: {},
  enableCleanup: true, // 默认启用清理功能
  cleanupNamespaces: ['auto'], // 默认只清理 'auto' 命名空间
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
    let camelCase = value
      .replace(/[^a-zA-Z0-9\s]/g, '') // 移除特殊字符，保留大小写
      .split(/\s+/) // 按空格分割
      .filter(word => word.length > 0) // 过滤空字符串
      .join(''); // 直接连接，不转换驼峰

    // 如果驼峰命名超过30个字符，截取前30个字符并添加12位hash
    if (camelCase.length > 30) {
      const hash = crypto.createHash('md5').update(value, 'utf8').digest('hex');
      camelCase = camelCase.substring(0, 30) + hash.substring(0, 12);
    }

    return `auto.${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
  }
}



// 优化的深度合并对象，保留已有值
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        // 只有当目标值不存在或为空时才覆盖
        if (result[key] === undefined || result[key] === null || result[key] === '') {
          result[key] = sourceValue;
        }
      }
    }
  }

  return result;
}

// 优化的locale文件更新
function updateLocaleFile(localeFilePath: string, keyValuePairs: KeyValuePair[]) {
  if (!keyValuePairs.length) return;

  // 确保目录存在
  const dir = path.dirname(localeFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 读取现有数据
  let existingData: Record<string, unknown> = {};
  if (fs.existsSync(localeFilePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'));
    } catch (error) {
      console.warn(`Failed to parse ${localeFilePath}:`, error);
    }
  }

  // 构建新数据并统计跳过的key
  const newData: Record<string, unknown> = {};
  const skippedKeys: string[] = [];
  
  keyValuePairs.forEach(({ key, value }) => {
    const existingValue = getNestedValue(existingData, key);
    if (existingValue && existingValue !== '') {
      skippedKeys.push(`"${key}" -> "${value}" (existing: "${existingValue}")`);
    } else {
      setNestedValue(newData, key, value);
    }
  });

  // 合并并写入
  if (Object.keys(newData).length > 0) {
    const mergedData = deepMerge(existingData, newData);
    fs.writeFileSync(localeFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
  }

  // 输出统计信息
  if (skippedKeys.length > 0) {
    console.log(`⏭️  Skipped ${skippedKeys.length} existing keys`);
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



// 统一的对象操作工具
const ObjectUtils = {
  // 收集所有key路径
  collectKeys(obj: Record<string, unknown>, prefix = ''): Set<string> {
    const keys = new Set<string>();
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedKeys = this.collectKeys(value as Record<string, unknown>, fullKey);
        nestedKeys.forEach(nestedKey => keys.add(nestedKey));
      } else {
        keys.add(fullKey);
      }
    }
    
    return keys;
  },

  // 删除嵌套key并清理空对象
  deleteKey(obj: Record<string, unknown>, keyPath: string[]): boolean {
    if (!keyPath.length) return false;
    
    if (keyPath.length === 1) {
      const key = keyPath[0];
      if (key in obj) {
        delete obj[key];
        return true;
      }
      return false;
    }

    const [currentKey, ...restPath] = keyPath;
    if (!(currentKey in obj) || typeof obj[currentKey] !== 'object' || obj[currentKey] === null) {
      return false;
    }
    
    const deleted = this.deleteKey(obj[currentKey] as Record<string, unknown>, restPath);
    
    // 清理空对象
    if (deleted && typeof obj[currentKey] === 'object' && 
        Object.keys(obj[currentKey] as Record<string, unknown>).length === 0) {
      delete obj[currentKey];
    }
    
    return deleted;
  },

  // 清理所有空对象
  cleanupEmpty(obj: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = this.cleanupEmpty(value as Record<string, unknown>);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  }
};

// 清理未使用的key
function cleanupUnusedKeys(
  localeFilePath: string,
  currentKeys: Set<string>,
  cleanupNamespaces: string[]
): number {
  if (!fs.existsSync(localeFilePath)) {
    return 0;
  }

  let localeData: Record<string, unknown> = {};
  try {
    const content = fs.readFileSync(localeFilePath, 'utf-8');
    localeData = JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to parse ${localeFilePath}:`, error);
    return 0;
  }

  // 收集locale文件中的所有key
  const allLocaleKeys = ObjectUtils.collectKeys(localeData);

  // 找出需要删除的key并删除
  let deletedCount = 0;
  allLocaleKeys.forEach(key => {
    const belongsToCleanupNamespace = cleanupNamespaces.some(namespace =>
      key.startsWith(`${namespace}.`)
    );

    if (belongsToCleanupNamespace && !currentKeys.has(key)) {
      if (ObjectUtils.deleteKey(localeData, key.split('.'))) {
        deletedCount++;
        console.log(`🗑️  Removed unused key: ${key}`);
      }
    }
  });

  // 如果有删除操作，清理空对象并写回文件
  if (deletedCount > 0) {
    const cleanedData = ObjectUtils.cleanupEmpty(localeData);
    fs.writeFileSync(localeFilePath, JSON.stringify(cleanedData, null, 2), 'utf-8');
    console.log(`🧹 Cleaned up ${deletedCount} unused keys from ${path.basename(localeFilePath)}`);
  }

  return deletedCount;
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
  // 优化的批量写入机制
  const pendingWrites = new Map<string, Set<string>>();
  const pendingKeyValuePairs = new Map<string, KeyValuePair[]>();
  let writeTimer: NodeJS.Timeout | null = null;

  // 批量写入队列处理
  function flushPendingWrites() {
    if (pendingKeyValuePairs.size === 0) return;

    console.log(`🔄 Flushing ${pendingKeyValuePairs.size} pending locale updates...`);

    // 批量执行所有待写入的操作
    const writePromises = Array.from(pendingKeyValuePairs.entries()).map(
      ([localeFilePath, keyValuePairs]) => updateLocaleFile(localeFilePath, keyValuePairs)
    );

    // 清理缓存
    pendingWrites.clear();
    pendingKeyValuePairs.clear();
    console.log('✅ All locale files updated');
    
    // 可选：等待所有写入完成
    Promise.all(writePromises).catch(error => {
      console.warn('Batch write failed:', error);
    });
  }

  // 添加到写入队列（优化去重）
  function queueLocaleUpdates(localeFilePath: string, keyValuePairs: KeyValuePair[]) {
    // 去重合并待写入的数据
    const existingPairs = pendingKeyValuePairs.get(localeFilePath) || [];
    const existingKeys = pendingWrites.get(localeFilePath) || new Set();
    
    const newPairs = keyValuePairs.filter(pair => !existingKeys.has(pair.key));
    if (newPairs.length === 0) return; // 没有新数据，跳过
    
    newPairs.forEach(pair => existingKeys.add(pair.key));
    pendingKeyValuePairs.set(localeFilePath, [...existingPairs, ...newPairs]);
    pendingWrites.set(localeFilePath, existingKeys);

    // 防抖写入，避免频繁I/O
    if (writeTimer) {
      clearTimeout(writeTimer);
    }
    writeTimer = setTimeout(flushPendingWrites, 200); // 减少到200ms防抖
  }

  // AST缓存，避免重复解析
  const astCache = new Map<string, { hash: string; ast: any }>();

  // 计算文件内容哈希（更高效）
  function getContentHash(content: string, mtime: number, size: number): string {
    return `${mtime}-${size}-${content.length}`;
  }

  // 从AST中提取key-value对
  function extractKeyValuePairs(ast: any, filePath: string): KeyValuePair[] {
    const keyValuePairs: KeyValuePair[] = [];

    try {
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
              const keyProperty = options.properties.find(
                prop => t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'key' })
              );
              if (
                keyProperty &&
                t.isObjectProperty(keyProperty) &&
                t.isStringLiteral(keyProperty.value)
              ) {
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
              line,
            });
          }
        },
      });
    } catch (error) {
      console.warn(`Failed to traverse AST for ${filePath}:`, error);
    }

    return keyValuePairs;
  }

  // 带AST缓存的文件解析
  function parseFileWithCache(
    filePath: string,
    content: string,
    mtime: number,
    size: number
  ): KeyValuePair[] {
    const hash = getContentHash(content, mtime, size);
    
    // 检查完整缓存
    const cached = fileCache.get(filePath);
    if (cached && cached.contentHash === hash) {
      return cached.keyValuePairs;
    }

    // 检查AST缓存
    let ast: any;
    const astCached = astCache.get(filePath);
    if (astCached && astCached.hash === hash) {
      ast = astCached.ast;
    } else {
      try {
        ast = parse(content, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties', 'objectRestSpread'],
        });
        astCache.set(filePath, { hash, ast });
      } catch (error) {
        console.warn(`Failed to parse ${filePath}:`, error);
        return [];
      }
    }

    const keyValuePairs = extractKeyValuePairs(ast, filePath);
    
    // 更新完整缓存
    fileCache.set(filePath, {
      content,
      mtime,
      size,
      contentHash: hash,
      keyValuePairs,
    });

    // 清理过期缓存
    cleanupCache();

    return keyValuePairs;
  }

  // 清理过期缓存
  function cleanupCache() {
    const maxCacheSize = 1000;
    if (fileCache.size > maxCacheSize) {
      const entries = Array.from(fileCache.entries());
      const toDelete = entries.slice(0, entries.length - maxCacheSize);
      toDelete.forEach(([key]) => {
        fileCache.delete(key);
        astCache.delete(key);
      });
    }
  }

  // 缓存扫描到的文件列表，避免重复扫描
  let cachedFileList: string[] | null = null;
  let fileListCacheTime = 0;
  const FILE_LIST_CACHE_TTL = 5000; // 5秒缓存

  // 获取所有需要扫描的文件（带缓存）
  function getAllScanFiles(): string[] {
    const now = Date.now();
    if (cachedFileList && (now - fileListCacheTime) < FILE_LIST_CACHE_TTL) {
      return cachedFileList;
    }

    const files: string[] = [];
    const excludeDirs = new Set(['node_modules', 'dist', '.git', '.vscode', '.next', 'build']);
    
    function scanDirectory(dir: string) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (!excludeDirs.has(entry.name)) {
              scanDirectory(fullPath);
            }
          } else if (
            entry.isFile() &&
            /\.(ts|tsx|js|jsx)$/.test(entry.name) &&
            !entry.name.endsWith('.d.ts')
          ) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // 忽略无法访问的目录
      }
    }

    scanDirectory(root);
    cachedFileList = files;
    fileListCacheTime = now;
    return files;
  }

  // 扫描所有文件收集key映射（优化版）
  function scanAllFiles() {
    console.log('🔍 Starting to scan all files for tAuto entries...');

    const files = getAllScanFiles();
    console.log(`📁 Found ${files.length} files to scan`);

    const allKeyValuePairs: KeyValuePair[] = [];
    let processedFiles = 0;

    // 批量处理文件，减少I/O阻塞
    for (const filePath of files) {
      try {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const keyValuePairs = parseFileWithCache(
          filePath,
          content,
          stats.mtime.getTime(),
          stats.size
        );

        if (keyValuePairs.length > 0) {
          console.log(
            `📄 ${path.relative(root, filePath)}: found ${keyValuePairs.length} tAuto entries`
          );
          allKeyValuePairs.push(...keyValuePairs);
        }

        // 更新全局映射和重复检测
        keyValuePairs.forEach(({ key, value, file, line }) => {
          globalKeyMapping.set(value, key);

          if (duplicateKeys.has(key)) {
            duplicateKeys.get(key)!.files.push({ file, line, value });
          } else {
            duplicateKeys.set(key, { key, files: [{ file, line, value }] });
          }
        });

        processedFiles++;
      } catch (error) {
        console.warn(`Failed to process ${filePath}:`, error);
      }
    }

    // 批量更新locale文件
    if (allKeyValuePairs.length > 0) {
      const localeFilePath = path.resolve(root, opts.localesDir, `${opts.defaultLocale}.json`);
      updateLocaleFile(localeFilePath, allKeyValuePairs);
      console.log(`📝 Updated locale file with ${allKeyValuePairs.length} entries`);
    }

    // 执行清理功能
    if (opts.enableCleanup) {
      const localeFilePath = path.resolve(root, opts.localesDir, `${opts.defaultLocale}.json`);
      const currentKeys = new Set(allKeyValuePairs.map(pair => pair.key));
      const deletedCount = cleanupUnusedKeys(localeFilePath, currentKeys, opts.cleanupNamespaces);

      if (deletedCount > 0) {
        console.log(`🧹 Cleanup completed: removed ${deletedCount} unused keys`);
      } else {
        console.log(`🧹 Cleanup completed: no unused keys found`);
      }
    }

    console.log(`✅ Scan completed: ${allKeyValuePairs.length} total entries from ${processedFiles} files`);

    // 输出重复key警告（仅显示真正重复的）
    const duplicateCount = Array.from(duplicateKeys.values()).filter(info => info.files.length > 1).length;
    if (duplicateCount > 0) {
      console.warn(`\n⚠️  Found ${duplicateCount} duplicate keys:`);
      duplicateKeys.forEach(info => {
        if (info.files.length > 1) {
          console.warn(`   "${info.key}" appears in ${info.files.length} locations`);
          info.files.forEach(({ file, line, value }) => {
            console.warn(`     - ${path.relative(root, file)}:${line} -> "${value}"`);
          });
        }
      });
    }
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
            ? (aliasPath as string)
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

        // 添加对所有相关文件的监听
        const addWatchFiles = (dir: string, context: any) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              if (!['node_modules', 'dist', '.git', '.vscode'].includes(entry.name)) {
                addWatchFiles(fullPath, context);
              }
            } else if (
              entry.isFile() &&
              /\.(ts|tsx|js|jsx)$/.test(entry.name) &&
              !entry.name.endsWith('.d.ts')
            ) {
              context.addWatchFile(fullPath);
            }
          }
        };

        addWatchFiles(root, this);

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

      // 重新扫描所有文件以确保全局key映射是最新的
      console.log(`🔄 File changed: ${path.relative(root, file)}, rescanning all files...`);

      // 清空当前的全局映射和重复key检测
      globalKeyMapping.clear();
      duplicateKeys.clear();

      // 重新扫描所有文件（包含清理功能）
      scanAllFiles();

      if (keyValuePairs.length > 0) {
        console.log(
          `✅ Found ${keyValuePairs.length} tAuto entries in ${path.relative(root, file)}`
        );
      }

      // 总是通知客户端刷新以更新key映射
      server.ws.send({
        type: 'full-reload',
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
    },
  };
}

export default autoI18nPlugin;
