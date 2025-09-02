import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
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
}

interface KeyValuePair {
  key: string;
  value: string;
  file: string;
  line: number;
}

const DEFAULT_OPTIONS: Required<AutoI18nOptions> = {
  localesDir: 'src/locales',
  defaultLocale: 'zh-CN',
  include: ['**/*.{ts,tsx,js,jsx}'],
  exclude: ['node_modules/**', 'dist/**', '**/*.d.ts']
};

// 生成key的函数
function generateKey(value: string): string {
  // 检查是否包含中文字符
  const hasChinese = /[\u4e00-\u9fff]/.test(value);
  
  if (hasChinese) {
    // 中文文本：只生成hash，不包含中文
    const hash = value.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    const positiveHash = Math.abs(hash);
    return `auto.${positiveHash}`;
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

// 更新JSON文件
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
  
  // 添加新的key-value对
  let hasChanges = false;
  for (const { key, value } of keyValuePairs) {
    if (!getNestedValue(localeData, key)) {
      setNestedValue(localeData, key, value);
      hasChanges = true;
      console.log(`Added key: ${key} = ${value}`);
    }
  }
  
  // 如果有变化，写入文件
  if (hasChanges) {
    const dir = path.dirname(localeFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(localeFilePath, JSON.stringify(localeData, null, 2), 'utf-8');
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
  // 全局key映射，在编译时收集所有key
  const globalKeyMapping = new Map<string, string>();
  
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
        const content = fs.readFileSync(filePath, 'utf-8');
        const keyValuePairs = parseFile(filePath, content);
        keyValuePairs.forEach(({ key, value }) => {
          globalKeyMapping.set(value, key);
        });
      }
    });
  }
  
  return {
    name: 'vite-plugin-auto-i18n',
    configResolved(config) {
      root = config.root;
    },
    
    buildStart() {
      // 在开发模式下，扫描所有文件并更新locale文件
      if (process.env.NODE_ENV === 'development') {
        this.addWatchFile(path.resolve(root, opts.localesDir));
        // 初始扫描所有文件，收集key映射
        scanAllFiles();
      }
    },
    
    handleHotUpdate({ file, server }) {
      // 只处理TypeScript/JavaScript文件
      if (!/\.(ts|tsx|js|jsx)$/.test(file)) {
        return;
      }
      
      // 读取文件内容
      const content = fs.readFileSync(file, 'utf-8');
      
      // 解析文件中的t函数调用
      const keyValuePairs = parseFile(file, content);
      
      if (keyValuePairs.length > 0) {
        // 更新全局key映射
        keyValuePairs.forEach(({ key, value }) => {
          globalKeyMapping.set(value, key);
        });
        
        // 更新默认语言的locale文件
        const localeFilePath = path.resolve(root, opts.localesDir, `${opts.defaultLocale}.json`);
        updateLocaleFile(localeFilePath, keyValuePairs);
        
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
      addKey: function(key, value) {
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