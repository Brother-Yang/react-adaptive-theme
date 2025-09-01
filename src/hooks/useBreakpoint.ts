import { useState, useEffect } from 'react';

// 定义断点类型（与插件配置保持一致）
export type BreakpointType = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// 定义断点配置（与插件配置保持一致）
export const BREAKPOINTS = {
  sm: 576,   // Small devices - 对应插件 Sm
  md: 768,   // Medium devices - 对应插件 Md
  lg: 992,   // Large devices - 对应插件 Lg
  xl: 1200,  // Extra large devices - 对应插件 Xl
  xxl: 1400  // Extra extra large devices - 对应插件 Xxl
} as const;

// 兼容性别名（保持向后兼容）
export const BREAKPOINT_ALIASES = {
  mobile: ['sm'] as const,
  pad: ['md'] as const,
  pc: ['lg', 'xl', 'xxl'] as const
} as const;

// 断点信息接口
export interface BreakpointInfo {
  current: BreakpointType;
  width: number;
  height: number;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  // 兼容性属性
  isMobile: boolean; // sm
  isPad: boolean;    // md
  isPc: boolean;     // lg + xl + xxl
}

/**
 * 获取当前断点类型
 * @param width 屏幕宽度
 * @returns 断点类型
 */
function getBreakpointType(width: number): BreakpointType {
  // 使用与插件相同的范围判断逻辑
  if (width < BREAKPOINTS.sm) {
    return 'sm'; // 小于576px时使用sm
  } else if (width >= BREAKPOINTS.sm && width < BREAKPOINTS.md) {
    return 'sm';
  } else if (width >= BREAKPOINTS.md && width < BREAKPOINTS.lg) {
    return 'md';
  } else if (width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl) {
    return 'lg';
  } else if (width >= BREAKPOINTS.xl && width < BREAKPOINTS.xxl) {
    return 'xl';
  } else {
    return 'xxl'; // 大于等于1400px时使用xxl
  }
}

/**
 * 创建断点信息对象
 * @param current 当前断点类型
 * @param width 屏幕宽度
 * @param height 屏幕高度
 * @returns 断点信息
 */
function createBreakpointInfo(current: BreakpointType, width: number, height: number): BreakpointInfo {
  return {
    current,
    width,
    height,
    isSm: current === 'sm',
    isMd: current === 'md',
    isLg: current === 'lg',
    isXl: current === 'xl',
    isXxl: current === 'xxl',
    // 兼容性属性
    isMobile: current === 'sm',
    isPad: current === 'md',
    isPc: current === 'lg' || current === 'xl' || current === 'xxl'
  };
}

/**
 * 响应式断点检测Hook
 * @returns 断点信息
 */
export function useBreakpoint(): BreakpointInfo {
  const [breakpointInfo, setBreakpointInfo] = useState<BreakpointInfo>(() => {
    // 初始化时获取当前窗口尺寸
    const width = typeof window !== 'undefined' ? window.innerWidth : 1400;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const current = getBreakpointType(width);
    
    return createBreakpointInfo(current, width, height);
  });

  useEffect(() => {
    // 防抖处理
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const current = getBreakpointType(width);
        
        setBreakpointInfo(createBreakpointInfo(current, width, height));
      }, 100); // 100ms 防抖
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 组件卸载时清理
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return breakpointInfo;
}

/**
 * 检查是否匹配指定断点
 * @param breakpoint 断点类型
 * @param width 当前宽度
 * @returns 是否匹配
 */
export function matchBreakpoint(breakpoint: BreakpointType, width: number): boolean {
  const breakpointValue = BREAKPOINTS[breakpoint];
  const breakpoints = Object.entries(BREAKPOINTS).sort(([,a], [,b]) => a - b);
  const currentIndex = breakpoints.findIndex(([key]) => key === breakpoint);
  
  if (currentIndex === 0) {
    return width < breakpointValue;
  } else if (currentIndex === breakpoints.length - 1) {
    return width >= breakpoints[currentIndex - 1][1];
  } else {
    return width >= breakpoints[currentIndex - 1][1] && width < breakpointValue;
  }
}

/**
 * 获取断点的CSS媒体查询字符串
 * @param breakpoint 断点类型
 * @returns CSS媒体查询字符串
 */
export function getBreakpointMediaQuery(breakpoint: BreakpointType): string {
  const breakpointValue = BREAKPOINTS[breakpoint];
  const breakpoints = Object.entries(BREAKPOINTS).sort(([,a], [,b]) => a - b);
  const currentIndex = breakpoints.findIndex(([key]) => key === breakpoint);
  
  if (currentIndex === 0) {
    return `(max-width: ${breakpointValue - 1}px)`;
  } else if (currentIndex === breakpoints.length - 1) {
    return `(min-width: ${breakpoints[currentIndex - 1][1]}px)`;
  } else {
    return `(min-width: ${breakpoints[currentIndex - 1][1]}px) and (max-width: ${breakpointValue - 1}px)`;
  }
}