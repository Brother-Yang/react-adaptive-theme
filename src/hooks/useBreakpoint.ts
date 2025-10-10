import { useState, useEffect, useDeferredValue } from 'react';
import {
  type BreakpointType,
  BREAKPOINTS,
  DEVICE_ALIASES,
  getCurrentBreakpoint,
} from '../config/breakpoints';

// 重新导出类型和常量以保持向后兼容
export type { BreakpointType };
export { BREAKPOINTS };

// 兼容性别名（保持向后兼容）
export const BREAKPOINT_ALIASES = DEVICE_ALIASES;

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
  isPad: boolean; // md
  isPc: boolean; // lg + xl + xxl
  // 新增设备类型判断
  isTablet: boolean; // md
  isDesktop: boolean; // lg + xl + xxl
}

/**
 * 获取当前断点类型（使用统一配置）
 * @param width 屏幕宽度
 * @returns 断点类型
 */
const getBreakpointType = getCurrentBreakpoint;

/**
 * 创建断点信息对象
 * @param current 当前断点类型
 * @param width 屏幕宽度
 * @param height 屏幕高度
 * @returns 断点信息
 */
function createBreakpointInfo(
  current: BreakpointType,
  width: number,
  height: number,
): BreakpointInfo {
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
    isPc: current === 'lg' || current === 'xl' || current === 'xxl',
    // 新增设备类型判断
    isTablet: current === 'md',
    isDesktop: current === 'lg' || current === 'xl' || current === 'xxl',
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

  // 使用 useDeferredValue 延迟非紧急的断点更新，减少重渲染
  const deferredBreakpointInfo = useDeferredValue(breakpointInfo);

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

  return deferredBreakpointInfo;
}

/**
 * 检查是否匹配指定断点
 * @param breakpoint 断点类型
 * @param width 当前宽度
 * @returns 是否匹配
 */
export function matchBreakpoint(breakpoint: BreakpointType, width: number): boolean {
  const breakpointValue = BREAKPOINTS[breakpoint];
  const breakpoints = Object.entries(BREAKPOINTS).sort(([, a], [, b]) => a - b);
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
  const breakpoints = Object.entries(BREAKPOINTS).sort(([, a], [, b]) => a - b);
  const currentIndex = breakpoints.findIndex(([key]) => key === breakpoint);

  if (currentIndex === 0) {
    return `(max-width: ${breakpointValue - 1}px)`;
  } else if (currentIndex === breakpoints.length - 1) {
    return `(min-width: ${breakpoints[currentIndex - 1][1]}px)`;
  } else {
    return `(min-width: ${breakpoints[currentIndex - 1][1]}px) and (max-width: ${
      breakpointValue - 1
    }px)`;
  }
}
