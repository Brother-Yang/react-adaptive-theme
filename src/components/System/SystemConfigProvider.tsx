import React, { type PropsWithChildren, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import type { Locale } from 'antd/es/locale';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { themeConfigs } from '@/config/theme';

// 使用对象映射根据当前语言设置选择Antd的locale
const localeMap: Record<string, Locale> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

const SystemConfigProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { themeMode, primaryColor } = useTheme();
  const { i18n } = useTranslation();
  
  // 使用useMemo缓存主题配置，避免频繁重建
  const currentTheme = useMemo(() => {
    const baseTheme = themeConfigs[themeMode];
    
    // 若设置了主色，则在AntD主题中覆盖 colorPrimary
    return primaryColor
      ? {
          ...baseTheme,
          token: {
            ...baseTheme.token,
            colorPrimary: primaryColor,
          },
          base: {
            ...baseTheme.base,
            colorPrimary: primaryColor,
          },
        }
      : baseTheme;
  }, [themeMode, primaryColor]);

  const antdLocale = localeMap[i18n.language] || enUS;

  return (
    <ConfigProvider locale={antdLocale} theme={currentTheme}>
      {children}
    </ConfigProvider>
  );
};

export default SystemConfigProvider;
