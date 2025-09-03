/**
 * 全局类型定义文件
 * 增强项目的类型安全性
 */

// 环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly BAIDU_APP_ID?: string;
  readonly BAIDU_SECRET_KEY?: string;
}

// 扩展 ImportMeta 接口
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// 窗口对象扩展
declare global {
  interface Window {
    // 自动国际化映射表
    __AUTO_I18N_MAPPING__?: Record<string, string>;
    // 主题配置
    __THEME_CONFIG__?: {
      mode: 'light' | 'dark' | 'auto';
      primaryColor?: string;
    };
  }
}

// CSS 模块类型定义
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 静态资源类型定义
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// 导出空对象以使此文件成为模块
export {};
