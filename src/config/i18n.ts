import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'

// 语言资源配置
const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
}

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '中文', nativeName: '中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' }
]

// 获取默认语言
export const getDefaultLanguage = (): string => {
  // 优先使用环境变量指定的语言
  const envLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE
  if (envLanguage && supportedLanguages.some(lang => lang.code === envLanguage)) {
    return envLanguage
  }
  
  // 优先使用localStorage中保存的语言
  const savedLanguage = localStorage.getItem('i18nextLng')
  if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
    return savedLanguage
  }
  
  // 检测浏览器语言
  const browserLanguage = navigator.language
  if (browserLanguage.startsWith('zh')) {
    return 'zh-CN'
  }
  
  // 默认返回英文
  return 'en-US'
}

// 初始化i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'en-US',
    
    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    
    // 插值配置
    interpolation: {
      escapeValue: false // React已经默认转义了
    },
    
    // 调试模式（生产环境建议关闭）
    debug: process.env.NODE_ENV === 'development'
  })

// 将i18n实例暴露到全局，供插件使用
if (typeof window !== 'undefined') {
  (window as typeof window & { i18n: typeof i18n }).i18n = i18n;
}

export default i18n