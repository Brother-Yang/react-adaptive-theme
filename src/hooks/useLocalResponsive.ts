import { useMemo } from 'react';
import { useBreakpoint } from './useBreakpoint';

// 支持的内容类型
type ResponsiveContent = string | number | React.ReactNode | (() => React.ReactNode);

// 断点内容映射
interface ResponsiveContentMap {
  xs?: ResponsiveContent;
  sm?: ResponsiveContent;
  md?: ResponsiveContent;
  lg?: ResponsiveContent;
  xl?: ResponsiveContent;
  xxl?: ResponsiveContent;
}

// Hook 配置选项
interface UseLocalResponsiveOptions {
  // 默认内容，当没有匹配的断点时使用
  defaultContent?: ResponsiveContent;
  // 是否启用回退机制（向下查找更小的断点）
  enableFallback?: boolean;
}

// 断点优先级顺序（从大到小）
const BREAKPOINT_ORDER = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

/**
 * 局部响应式内容 Hook
 * 根据当前断点返回对应的内容，支持文本、数字、React 节点或函数
 * 
 * @param contentMap 断点内容映射
 * @param options 配置选项
 * @returns 当前断点对应的内容
 * 
 * @example
 * ```tsx
 * const content = useLocalResponsive({
 *   xs: '小屏幕内容',
 *   sm: '中小屏幕内容', 
 *   md: '中等屏幕内容',
 *   lg: '大屏幕内容',
 *   xl: '超大屏幕内容'
 * }, {
 *   defaultContent: '默认内容',
 *   enableFallback: true
 * });
 * 
 * return <div>{content}</div>;
 * ```
 */
export const useLocalResponsive = (
  contentMap: ResponsiveContentMap,
  options: UseLocalResponsiveOptions = {}
): ResponsiveContent => {
  const breakpointInfo = useBreakpoint();
  const currentBreakpoint = breakpointInfo.current;
  const { defaultContent, enableFallback = true } = options;

  const resolvedContent = useMemo(() => {
    // 首先尝试获取当前断点的内容
    let content = contentMap[currentBreakpoint];
    
    if (content !== undefined) {
      return content;
    }

    // 如果启用回退机制，向下查找更小的断点
    if (enableFallback) {
      const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);
      
      // 从当前断点开始，向后查找（更小的断点）
      for (let i = currentIndex + 1; i < BREAKPOINT_ORDER.length; i++) {
        const fallbackBreakpoint = BREAKPOINT_ORDER[i];
        content = contentMap[fallbackBreakpoint];
        
        if (content !== undefined) {
          return content;
        }
      }
    }

    // 如果没有找到匹配的内容，返回默认内容
    return defaultContent;
  }, [currentBreakpoint, contentMap, defaultContent, enableFallback]);

  // 如果内容是函数，则执行它
  if (typeof resolvedContent === 'function') {
    return (resolvedContent as () => React.ReactNode)();
  }

  return resolvedContent;
};

/**
 * 简化版本的局部响应式 Hook
 * 只支持字符串内容，适用于简单的文本替换场景
 * 
 * @param contentMap 断点文本映射
 * @param defaultContent 默认文本
 * @returns 当前断点对应的文本
 * 
 * @example
 * ```tsx
 * const title = useLocalResponsiveText({
 *   xs: '移动端标题',
 *   md: '桌面端标题'
 * }, '默认标题');
 * 
 * return <h1>{title}</h1>;
 * ```
 */
export const useLocalResponsiveText = (
  contentMap: Record<string, string>,
  defaultContent: string = ''
): string => {
  const content = useLocalResponsive(contentMap, { 
    defaultContent, 
    enableFallback: true 
  });
  
  return String(content || defaultContent);
};

/**
 * 数值响应式 Hook
 * 专门用于处理数值类型的响应式变化，如尺寸、间距等
 * 
 * @param valueMap 断点数值映射
 * @param defaultValue 默认数值
 * @returns 当前断点对应的数值
 * 
 * @example
 * ```tsx
 * const fontSize = useLocalResponsiveValue({
 *   xs: 12,
 *   sm: 14,
 *   md: 16,
 *   lg: 18
 * }, 16);
 * 
 * return <div style={{ fontSize }}>{content}</div>;
 * ```
 */
export const useLocalResponsiveValue = (
  valueMap: Record<string, number>,
  defaultValue: number = 0
): number => {
  const value = useLocalResponsive(valueMap, { 
    defaultContent: defaultValue, 
    enableFallback: true 
  });
  
  return Number(value) || defaultValue;
};

export default useLocalResponsive;