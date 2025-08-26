import React, { useMemo } from 'react';
import { useBreakpoint, type BreakpointType } from './useBreakpoint';

// 响应式组件映射类型
export interface ResponsiveComponentMap<T = React.ComponentType<unknown>> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T; // 默认组件（必需）
}

// 组件后缀映射
const COMPONENT_SUFFIX_MAP: Record<BreakpointType, string> = {
  xs: 'Xs',
  sm: 'Sm', 
  md: 'Md',
  lg: 'Lg',
  xl: 'Xl'
};

/**
 * 响应式组件加载Hook
 * 根据当前断点自动选择合适的组件变体
 * 
 * @param componentMap 响应式组件映射对象
 * @returns 当前断点对应的组件
 * 
 * @example
 * ```tsx
 * import Header from './Header';
 * import HeaderSm from './Header.Sm';
 * import HeaderMd from './Header.Md';
 * 
 * const ResponsiveHeader = () => {
 *   const Component = useResponsiveComponent({
 *     sm: HeaderSm,
 *     md: HeaderMd,
 *     default: Header
 *   });
 *   
 *   return <Component />;
 * };
 * ```
 */
export function useResponsiveComponent<T>(componentMap: ResponsiveComponentMap<T>): T {
  const { current } = useBreakpoint();
  
  return useMemo(() => {
    // 按优先级查找组件：当前断点 -> 默认组件
    return componentMap[current] || componentMap.default;
  }, [current, componentMap]);
}

/**
 * 生成组件文件名后缀
 * @param breakpoint 断点类型
 * @returns 文件名后缀
 * 
 * @example
 * ```tsx
 * getComponentSuffix('sm') // 返回 'Sm'
 * getComponentSuffix('lg') // 返回 'Lg'
 * ```
 */
export function getComponentSuffix(breakpoint: BreakpointType): string {
  return COMPONENT_SUFFIX_MAP[breakpoint];
}

/**
 * 生成完整的响应式组件文件名
 * @param baseName 基础组件名
 * @param breakpoint 断点类型
 * @returns 完整的组件文件名
 * 
 * @example
 * ```tsx
 * getResponsiveComponentName('Header', 'sm') // 返回 'Header.Sm'
 * getResponsiveComponentName('Sidebar', 'lg') // 返回 'Sidebar.Lg'
 * ```
 */
export function getResponsiveComponentName(baseName: string, breakpoint: BreakpointType): string {
  return `${baseName}.${getComponentSuffix(breakpoint)}`;
}

/**
 * 响应式组件工厂函数
 * 用于创建支持多断点的响应式组件
 * 
 * @param componentMap 响应式组件映射
 * @returns 响应式组件
 * 
 * @example
 * ```tsx
 * import Header from './Header';
 * import HeaderSm from './Header.Sm';
 * import HeaderMd from './Header.Md';
 * 
 * export const ResponsiveHeader = createResponsiveComponent({
 *   sm: HeaderSm,
 *   md: HeaderMd,
 *   default: Header
 * });
 * ```
 */
export function createResponsiveComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  componentMap: ResponsiveComponentMap<React.ComponentType<P>>
): React.ComponentType<P> {
  return function ResponsiveComponent(props: P) {
    const Component = useResponsiveComponent(componentMap);
    return React.createElement(Component, props);
  };
}

/**
 * 断点优先级映射（用于回退逻辑）
 * 当指定断点的组件不存在时，按此优先级查找替代组件
 */
const BREAKPOINT_FALLBACK_ORDER: Record<BreakpointType, BreakpointType[]> = {
  xs: ['sm', 'md', 'lg', 'xl'],
  sm: ['xs', 'md', 'lg', 'xl'],
  md: ['sm', 'lg', 'xs', 'xl'],
  lg: ['md', 'xl', 'sm', 'xs'],
  xl: ['lg', 'md', 'sm', 'xs']
};

/**
 * 智能响应式组件选择Hook
 * 支持回退逻辑，当目标断点组件不存在时自动选择最接近的替代组件
 * 
 * @param componentMap 响应式组件映射对象
 * @returns 当前断点对应的组件（含回退逻辑）
 */
export function useSmartResponsiveComponent<T>(componentMap: ResponsiveComponentMap<T>): T {
  const { current } = useBreakpoint();
  
  return useMemo(() => {
    // 首先尝试当前断点
    if (componentMap[current]) {
      return componentMap[current];
    }
    
    // 按回退优先级查找
    const fallbackOrder = BREAKPOINT_FALLBACK_ORDER[current];
    for (const fallbackBreakpoint of fallbackOrder) {
      if (componentMap[fallbackBreakpoint]) {
        return componentMap[fallbackBreakpoint];
      }
    }
    
    // 最后使用默认组件
    return componentMap.default;
  }, [current, componentMap]);
}