import { useState, useEffect } from 'react';

// 定义断点类型
export type BreakpointType = 'mobile' | 'pad' | 'pc';

// 定义断点配置
export const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  pad: { min: 768, max: 1199 },
  pc: { min: 1200, max: Infinity }
} as const;

// 断点信息接口
export interface BreakpointInfo {
  current: BreakpointType;
  width: number;
  height: number;
  isMobile: boolean;
  isPad: boolean;
  isPc: boolean;
}

/**
 * 获取当前断点类型
 * @param width 屏幕宽度
 * @returns 断点类型
 */
function getBreakpointType(width: number): BreakpointType {
  if (width <= BREAKPOINTS.mobile.max) {
    return 'mobile';
  } else if (width >= BREAKPOINTS.pad.min && width <= BREAKPOINTS.pad.max) {
    return 'pad';
  } else {
    return 'pc';
  }
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
    
    return {
      current,
      width,
      height,
      isMobile: current === 'mobile',
      isPad: current === 'pad',
      isPc: current === 'pc'
    };
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
        
        setBreakpointInfo({
          current,
          width,
          height,
          isMobile: current === 'mobile',
          isPad: current === 'pad',
          isPc: current === 'pc'
        });
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