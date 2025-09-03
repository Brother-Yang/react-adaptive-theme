#!/usr/bin/env node

import { translate } from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pLimit from 'p-limit';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetLanguages = ['en-US'];

// 性能优化配置
const PERFORMANCE_CONFIG = {
  concurrency: 3, // 并发翻译数量
  batchSize: 5, // 批量翻译大小
  cacheEnabled: true, // 启用缓存
  retryAttempts: 3, // 重试次数
  retryDelay: 1000, // 重试延迟(ms)
  apiDelay: 100 // API调用间隔(ms)
};

// 翻译缓存
const translationCache = new Map();
const cacheFilePath = path.join(__dirname, 'scripts/.translation-cache.json');

// 并发控制
const limit = pLimit(PERFORMANCE_CONFIG.concurrency);

// 语言代码映射 (ISO 639-1 到 Google Translate API 格式)
const LANGUAGE_MAP = {
  'zh-CN': 'zh',
  'en-US': 'en',
  'pt-PT': 'pt',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'es-ES': 'es',
  'it-IT': 'it',
  'ru-RU': 'ru'
};

// 缓存管理功能
function loadCache() {
  if (!PERFORMANCE_CONFIG.cacheEnabled) return;
  
  try {
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
      Object.entries(cacheData).forEach(([key, value]) => {
        translationCache.set(key, value);
      });
      console.log(`📦 已加载缓存，共 ${translationCache.size} 条记录`);
    }
  } catch (error) {
    console.warn('⚠️  缓存加载失败:', error.message);
  }
}

function saveCache() {
  if (!PERFORMANCE_CONFIG.cacheEnabled || translationCache.size === 0) return;
  
  try {
    const cacheDir = path.dirname(cacheFilePath);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const cacheData = Object.fromEntries(translationCache);
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    console.log(`💾 缓存已保存，共 ${translationCache.size} 条记录`);
  } catch (error) {
    console.warn('⚠️  缓存保存失败:', error.message);
  }
}

function getCacheKey(text, sourceLang, targetLang) {
  return crypto.createHash('md5').update(`${text}|${sourceLang}|${targetLang}`).digest('hex');
}

// 批量翻译功能
async function translateBatch(texts, sourceLang, targetLang) {
  if (texts.length === 0) return [];
  
  // 检查缓存
  const results = [];
  const uncachedTexts = [];
  const uncachedIndexes = [];
  
  texts.forEach((text, index) => {
    const cacheKey = getCacheKey(text, sourceLang, targetLang);
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey);
    } else {
      uncachedTexts.push(text);
      uncachedIndexes.push(index);
    }
  });
  
  if (uncachedTexts.length === 0) {
    console.log(`🎯 全部命中缓存，跳过 ${texts.length} 个文本`);
    return results;
  }
  
  console.log(`🔄 批量翻译 ${uncachedTexts.length} 个文本 (缓存命中: ${texts.length - uncachedTexts.length})`);
  
  try {
    // 合并文本进行批量翻译
    const separator = ' |SEPARATOR| ';
    const combinedText = uncachedTexts.join(separator);
    
    const translated = await translate(combinedText, {
      from: sourceLang,
      to: LANGUAGE_MAP[targetLang],
      forceFrom: true
    });
    
    const translatedTexts = translated.text.split(separator);
    
    // 处理翻译结果
    uncachedIndexes.forEach((originalIndex, i) => {
      const translatedText = translatedTexts[i] || uncachedTexts[i];
      results[originalIndex] = translatedText;
      
      // 保存到缓存
      const cacheKey = getCacheKey(uncachedTexts[i], sourceLang, targetLang);
      translationCache.set(cacheKey, translatedText);
    });
    
    return results;
  } catch (error) {
    console.warn('⚠️  批量翻译失败，回退到单个翻译:', error.message);
    
    // 回退到单个翻译
    const fallbackResults = await Promise.all(
      uncachedTexts.map(async (text, i) => {
        try {
          const result = await translateSingle(text, sourceLang, targetLang);
          return result;
        } catch (err) {
          console.error(`❌ 单个翻译失败: ${text}`, err.message);
          return text;
        }
      })
    );
    
    uncachedIndexes.forEach((originalIndex, i) => {
      results[originalIndex] = fallbackResults[i];
    });
    
    return results;
  }
}

// 单个翻译功能（带重试机制）
async function translateSingle(text, sourceLang, targetLang, attempt = 1) {
  const cacheKey = getCacheKey(text, sourceLang, targetLang);
  
  // 检查缓存
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    const translated = await translate(text, {
      from: sourceLang,
      to: LANGUAGE_MAP[targetLang],
      forceFrom: true
    });
    
    // 保存到缓存
    translationCache.set(cacheKey, translated.text);
    return translated.text;
  } catch (error) {
    if (attempt < PERFORMANCE_CONFIG.retryAttempts) {
      console.warn(`⚠️  翻译失败，重试 ${attempt}/${PERFORMANCE_CONFIG.retryAttempts}: ${text}`);
      await new Promise(resolve => setTimeout(resolve, PERFORMANCE_CONFIG.retryDelay * attempt));
      return translateSingle(text, sourceLang, targetLang, attempt + 1);
    }
    throw error;
  }
}

// 从.env文件读取默认语言
function getDefaultLanguage() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env文件不存在，使用默认语言: zh-CN');
    return 'zh-CN';
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_DEFAULT_LANGUAGE=(.+)/);
  return match ? match[1].trim() : 'zh-CN';
}

// 读取默认语言的翻译文件
function loadDefaultTranslations(defaultLang) {
  const defaultFilePath = path.join(__dirname, `../src/locales/${defaultLang}.json`);
  if (!fs.existsSync(defaultFilePath)) {
    throw new Error(`默认语言文件不存在: ${defaultFilePath}`);
  }
  
  const content = fs.readFileSync(defaultFilePath, 'utf-8');
  return JSON.parse(content);
}

// 收集所有需要翻译的文本
function collectTexts(obj, path = '') {
  const texts = [];
  
  function traverse(current, currentPath) {
    for (const [key, value] of Object.entries(current)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'string') {
        texts.push({ path: fullPath, text: value, key });
      } else if (typeof value === 'object' && value !== null) {
        traverse(value, fullPath);
      }
    }
  }
  
  traverse(obj, path);
  return texts;
}

// 处理插值变量
function processInterpolation(text) {
  const hasInterpolation = /\{\{\w+\}\}/.test(text);
  
  if (!hasInterpolation) {
    return { processedText: text, placeholders: [] };
  }
  
  const placeholders = [];
  let processedText = text;
  
  const interpolations = text.match(/\{\{\w+\}\}/g) || [];
  interpolations.forEach((interpolation, index) => {
    const placeholder = `__PLACEHOLDER_${index}__`;
    placeholders.push({ placeholder, interpolation });
    processedText = processedText.replace(interpolation, ` ${placeholder} `);
  });
  
  return { processedText, placeholders };
}

// 恢复插值变量
function restoreInterpolation(translatedText, placeholders) {
  let finalText = translatedText;
  placeholders.forEach(({ placeholder, interpolation }) => {
    const regex = new RegExp(`\\s*${placeholder}\\s*`, 'gi');
    finalText = finalText.replace(regex, ` ${interpolation} `);
  });
  return finalText.trim();
}

// 优化的递归翻译对象函数
async function translateObject(obj, targetLang, sourceLang = 'zh', path = '') {
  console.log(`📁 开始处理对象: ${path || 'root'}`);
  
  // 收集所有需要翻译的文本
  const allTexts = collectTexts(obj, path);
  console.log(`📝 发现 ${allTexts.length} 个待翻译文本`);
  
  if (allTexts.length === 0) {
    return obj;
  }
  
  // 处理插值变量
  const processedTexts = allTexts.map(item => {
    const { processedText, placeholders } = processInterpolation(item.text);
    return { ...item, processedText, placeholders };
  });
  
  // 分批处理翻译
  const batchSize = PERFORMANCE_CONFIG.batchSize;
  const translatedResults = [];
  
  for (let i = 0; i < processedTexts.length; i += batchSize) {
    const batch = processedTexts.slice(i, i + batchSize);
    console.log(`🔄 处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(processedTexts.length / batchSize)} (${batch.length} 个文本)`);
    
    // 使用并发控制进行批量翻译
    const batchPromises = batch.map(item => 
      limit(async () => {
        try {
          const translated = await translateSingle(item.processedText, sourceLang, targetLang);
          const finalText = restoreInterpolation(translated, item.placeholders);
          console.log(`✅ ${item.path}: "${item.text}" -> "${finalText}"`);
          return { ...item, translatedText: finalText };
        } catch (error) {
          console.error(`❌ 翻译失败 ${item.path}:`, error.message);
          return { ...item, translatedText: item.text };
        }
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    translatedResults.push(...batchResults);
    
    // 批次间延迟
    if (i + batchSize < processedTexts.length) {
      await new Promise(resolve => setTimeout(resolve, PERFORMANCE_CONFIG.apiDelay));
    }
  }
  
  // 重建对象结构
  const result = JSON.parse(JSON.stringify(obj)); // 深拷贝
  
  translatedResults.forEach(item => {
    const pathParts = item.path.split('.');
    let current = result;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = item.translatedText;
  });
  
  return result;
}

// 保存翻译结果
function saveTranslation(targetLang, translations) {
  const outputPath = path.join(__dirname, `../src/locales/${targetLang}.json`);
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf-8');
  console.log(`💾 翻译文件已保存: ${outputPath}`);
}

// 检查是否需要增量更新
function needsUpdate(defaultTranslations, targetLang) {
  const targetFilePath = path.join(__dirname, `src/locales/${targetLang}.json`);
  
  if (!fs.existsSync(targetFilePath)) {
    console.log(`📄 目标文件不存在，需要完整翻译: ${targetLang}`);
    return { needsUpdate: true, isIncremental: false };
  }
  
  try {
    const existingTranslations = JSON.parse(fs.readFileSync(targetFilePath, 'utf-8'));
    
    // 收集所有键
    const defaultKeys = new Set();
    const existingKeys = new Set();
    
    function collectKeys(obj, keySet, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'string') {
          keySet.add(fullKey);
        } else if (typeof value === 'object' && value !== null) {
          collectKeys(value, keySet, fullKey);
        }
      }
    }
    
    collectKeys(defaultTranslations, defaultKeys);
    collectKeys(existingTranslations, existingKeys);
    
    // 检查是否有新增或修改的键
    const newKeys = [...defaultKeys].filter(key => !existingKeys.has(key));
    const removedKeys = [...existingKeys].filter(key => !defaultKeys.has(key));
    
    if (newKeys.length > 0 || removedKeys.length > 0) {
      console.log(`🔄 检测到变更: 新增 ${newKeys.length} 个，删除 ${removedKeys.length} 个键`);
      return { needsUpdate: true, isIncremental: true, newKeys, removedKeys };
    }
    
    console.log(`✅ ${targetLang} 翻译文件已是最新`);
    return { needsUpdate: false };
  } catch (error) {
    console.warn(`⚠️  检查更新状态失败: ${error.message}，执行完整翻译`);
    return { needsUpdate: true, isIncremental: false };
  }
}

// 增量更新翻译
async function incrementalUpdate(defaultTranslations, existingTranslations, newKeys, targetLang, sourceLang) {
  console.log(`🔄 执行增量更新，翻译 ${newKeys.length} 个新键`);
  
  // 创建只包含新键的对象
  const newTranslations = {};
  
  function extractNewKeys(defaultObj, newObj, prefix = '') {
    for (const [key, value] of Object.entries(defaultObj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        if (newKeys.includes(fullKey)) {
          newObj[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        const hasNewChildren = newKeys.some(newKey => newKey.startsWith(fullKey + '.'));
        if (hasNewChildren) {
          newObj[key] = {};
          extractNewKeys(value, newObj[key], fullKey);
        }
      }
    }
  }
  
  extractNewKeys(defaultTranslations, newTranslations);
  
  // 翻译新内容
  const translatedNew = await translateObject(newTranslations, targetLang, sourceLang);
  
  // 合并到现有翻译
  function mergeTranslations(existing, newTrans) {
    const result = { ...existing };
    
    for (const [key, value] of Object.entries(newTrans)) {
      if (typeof value === 'object' && value !== null) {
        result[key] = result[key] ? mergeTranslations(result[key], value) : value;
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  return mergeTranslations(existingTranslations, translatedNew);
}

// 主函数
async function generateTranslations(targetLanguages) {
  const startTime = Date.now();
  
  try {
    console.log('🚀 开始生成翻译文件...');
    console.log(`⚙️  性能配置: 并发数=${PERFORMANCE_CONFIG.concurrency}, 批量大小=${PERFORMANCE_CONFIG.batchSize}`);
    
    // 加载缓存
    loadCache();
    
    // 获取默认语言
    const defaultLang = getDefaultLanguage();
    console.log(`📖 默认语言: ${defaultLang}`);
    
    // 加载默认语言翻译
    const defaultTranslations = loadDefaultTranslations(defaultLang);
    console.log(`📚 已加载默认翻译文件，共 ${Object.keys(defaultTranslations).length} 个顶级键`);
    
    // 获取源语言代码
    const sourceLang = LANGUAGE_MAP[defaultLang] || 'zh';
    
    // 为每个目标语言生成翻译
    for (const targetLang of targetLanguages) {
      if (!LANGUAGE_MAP[targetLang]) {
        console.warn(`⚠️  不支持的语言代码: ${targetLang}，跳过`);
        continue;
      }
      
      if (targetLang === defaultLang) {
        console.log(`⏭️  跳过默认语言: ${targetLang}`);
        continue;
      }
      
      console.log(`\n🌍 开始处理: ${targetLang}`);
      
      // 检查是否需要更新
      const updateInfo = needsUpdate(defaultTranslations, targetLang);
      
      if (!updateInfo.needsUpdate) {
        continue;
      }
      
      let translatedContent;
      
      if (updateInfo.isIncremental && updateInfo.newKeys.length > 0) {
        // 增量更新
        const existingTranslations = JSON.parse(
          fs.readFileSync(path.join(__dirname, `src/locales/${targetLang}.json`), 'utf-8')
        );
        translatedContent = await incrementalUpdate(
          defaultTranslations,
          existingTranslations,
          updateInfo.newKeys,
          targetLang,
          sourceLang
        );
      } else {
        // 完整翻译
        translatedContent = await translateObject(
          defaultTranslations,
          targetLang,
          sourceLang
        );
      }
      
      saveTranslation(targetLang, translatedContent);
      console.log(`✅ ${targetLang} 翻译完成`);
    }
    
    // 保存缓存
    saveCache();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 所有翻译文件生成完成！耗时: ${duration}s`);
    console.log(`📊 缓存统计: ${translationCache.size} 条记录`);
    
  } catch (error) {
    console.error('❌ 生成翻译文件时出错:', error);
    // 确保保存缓存
    saveCache();
    process.exit(1);
  }
}

// 直接运行翻译
console.log(`🎯 目标语言: ${targetLanguages.join(', ')}`);
generateTranslations(targetLanguages);

export { generateTranslations, translateObject, loadDefaultTranslations };