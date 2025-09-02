import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 声明全局类型
declare global {
  interface Window {
    __AUTO_I18N_PLUGIN__?: {
      t: (value: string, options?: { key?: string } & Record<string, string | number | boolean>) => string;
    };
  }
}

export function useAutoTranslation() {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  // 直接使用插件提供的翻译函数
  const tAuto = useCallback((value: string, options?: { key?: string } & Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.__AUTO_I18N_PLUGIN__?.t) {
      return window.__AUTO_I18N_PLUGIN__.t(value, options);
    }
    console.warn('Auto i18n plugin not available, falling back to original value');
    return value;
  }, []);
  
  return useMemo(() => ({
    tAuto,
    locale,
    i18n,
  }), [tAuto, locale, i18n]);
}

export default useAutoTranslation;