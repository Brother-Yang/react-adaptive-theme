import { useState, useEffect } from 'react';

// 定义断点类型（按照前端国际标准）
export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 定义断点配置（符合Bootstrap 5、Material Design等国际标准）
export const BREAKPOINTS = {
  xs: { min: 0, max: 575 },      // Extra small devices (portrait phones)
  sm: { min: 576, max: 767 },   // Small devices (landscape phones)
  md: { min: 768, max: 991 },   // Medium devices (tablets)
  lg: { min: 992, max: 1199 },  // Large devices (desktops)
  xl: { min: 1200, max: Infinity } // Extra large devices (large desktops)
} as const;

// 兼容性别名（保持向后兼容）
export const BREAKPOINT_ALIASES = {
  mobile: ['xs', 'sm'] as const,
  pad: ['md'] as const,
  pc: ['lg', 'xl'] as const
} as const;

// 断点信息接口
export interface BreakpointInfo {
  current: BreakpointType;
  width: number;
  height: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  // 兼容性属性
  isMobile: boolean; // xs + sm
  isPad: boolean;    // md
  isPc: boolean;     // lg + xl
}

/**
 * 获取当前断点类型
 * @param width 屏幕宽度
 * @returns 断点类型
 */
function getBreakpointType(width: number): BreakpointType {
  if (width <= BREAKPOINTS.xs.max) {
    return 'xs';
  } else if (width >= BREAKPOINTS.sm.min && width <= BREAKPOINTS.sm.max) {
    return 'sm';
  } else if (width >= BREAKPOINTS.md.min && width <= BREAKPOINTS.md.max) {
    return 'md';
  } else if (width >= BREAKPOINTS.lg.min && width <= BREAKPOINTS.lg.max) {
    return 'lg';
  } else {
    return 'xl';
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
    isXs: current === 'xs',
    isSm: current === 'sm',
    isMd: current === 'md',
    isLg: current === 'lg',
    isXl: current === 'xl',
    // 兼容性属性
    isMobile: current === 'xs' || current === 'sm',
    isPad: current === 'md',
    isPc: current === 'lg' || current === 'xl'
  };
}

/**
 * 响应式断点检测Hook
 * @returns 断点信息
 */
export function useBreakpoint(): BreakpointInfo {
  const [breakpointInfo, setBreakpointInfo] = useState<BreakpointInfo>(() => {
    // 初始化时获取当前窗口尺寸
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const current = getBreakpointType(width);
    
    return createBreakpointInfo(current, width, height);
  });

  useEffect(() => {
    // 防抖处理
    let timeoutId: number;
    
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
  const config = BREAKPOINTS[breakpoint];
  return width >= config.min && width <= config.max;
}

/**
 * 获取断点的CSS媒体查询字符串
 * @param breakpoint 断点类型
 * @returns CSS媒体查询字符串
 */
export function getBreakpointMediaQuery(breakpoint: BreakpointType): string {
  const config = BREAKPOINTS[breakpoint];
  
  if (config.max === Infinity) {
    return `(min-width: ${config.min}px)`;
  } else if (config.min === 0) {
    return `(max-width: ${config.max}px)`;
  } else {
    return `(min-width: ${config.min}px) and (max-width: ${config.max}px)`;
  }
}