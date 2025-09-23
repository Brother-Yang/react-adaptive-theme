/**
 * 统一的断点配置文件
 * 用于整个应用的响应式设计，确保所有组件和 hooks 使用一致的断点配置
 */

// 断点类型定义
export type BreakpointType = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// 断点数值配置（像素值）
export const BREAKPOINTS = {
  sm: 576, // Small devices (landscape phones, 576px and up)
  md: 768, // Medium devices (tablets, 768px and up)
  lg: 992, // Large devices (desktops, 992px and up)
  xl: 1200, // Extra large devices (large desktops, 1200px and up)
  xxl: 1400, // Extra extra large devices (larger desktops, 1400px and up)
} as const;

// 断点范围配置（用于媒体查询）
export const BREAKPOINT_RANGES = {
  sm: { min: BREAKPOINTS.sm, max: BREAKPOINTS.md - 1 },
  md: { min: BREAKPOINTS.md, max: BREAKPOINTS.lg - 1 },
  lg: { min: BREAKPOINTS.lg, max: BREAKPOINTS.xl - 1 },
  xl: { min: BREAKPOINTS.xl, max: BREAKPOINTS.xxl - 1 },
  xxl: { min: BREAKPOINTS.xxl, max: Infinity },
} as const;

// 断点优先级顺序（从大到小，用于回退机制）
export const BREAKPOINT_ORDER: readonly BreakpointType[] = ['xxl', 'xl', 'lg', 'md', 'sm'] as const;

// 断点回退顺序配置（智能回退机制）
export const BREAKPOINT_FALLBACK_ORDER: Record<BreakpointType, BreakpointType[]> = {
  sm: ['md', 'lg', 'xl', 'xxl'],
  md: ['sm', 'lg', 'xl', 'xxl'],
  lg: ['md', 'xl', 'sm', 'xxl'],
  xl: ['lg', 'xxl', 'md', 'sm'],
  xxl: ['xl', 'lg', 'md', 'sm'],
} as const;

// 设备类型别名（向后兼容）
export const DEVICE_ALIASES = {
  mobile: ['sm'] as const,
  tablet: ['md'] as const,
  desktop: ['lg', 'xl', 'xxl'] as const,
  // 旧版本兼容
  pad: ['md'] as const,
  pc: ['lg', 'xl', 'xxl'] as const,
} as const;

// 组件后缀映射（用于文件命名）
export const COMPONENT_SUFFIX_MAP: Record<BreakpointType, string> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

// 媒体查询生成器
export const createMediaQuery = (
  breakpoint: BreakpointType,
  type: 'min' | 'max' | 'only' = 'min',
): string => {
  const range = BREAKPOINT_RANGES[breakpoint];

  switch (type) {
    case 'min':
      return `@media (min-width: ${range.min}px)`;
    case 'max':
      return range.max === Infinity
        ? `@media (min-width: ${range.min}px)`
        : `@media (max-width: ${range.max}px)`;
    case 'only':
      return range.max === Infinity
        ? `@media (min-width: ${range.min}px)`
        : `@media (min-width: ${range.min}px) and (max-width: ${range.max}px)`;
    default:
      return `@media (min-width: ${range.min}px)`;
  }
};

// 断点匹配函数
export const matchBreakpoint = (breakpoint: BreakpointType, width: number): boolean => {
  const range = BREAKPOINT_RANGES[breakpoint];
  return width >= range.min && (range.max === Infinity || width <= range.max);
};

// 获取当前断点
export const getCurrentBreakpoint = (width: number): BreakpointType => {
  // 从大到小检查断点
  for (const bp of BREAKPOINT_ORDER) {
    if (matchBreakpoint(bp, width)) {
      return bp;
    }
  }
  return 'sm'; // 默认返回最小断点
};

// 断点比较函数
export const compareBreakpoints = (a: BreakpointType, b: BreakpointType): number => {
  const indexA = BREAKPOINT_ORDER.indexOf(a);
  const indexB = BREAKPOINT_ORDER.indexOf(b);
  return indexB - indexA; // 大的断点排在前面
};

// 检查断点是否大于等于指定断点
export const isBreakpointUp = (current: BreakpointType, target: BreakpointType): boolean => {
  return compareBreakpoints(current, target) >= 0;
};

// 检查断点是否小于等于指定断点
export const isBreakpointDown = (current: BreakpointType, target: BreakpointType): boolean => {
  return compareBreakpoints(current, target) <= 0;
};

// 获取断点的下一个更大的断点
export const getNextBreakpointUp = (breakpoint: BreakpointType): BreakpointType | null => {
  const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
  return currentIndex > 0 ? BREAKPOINT_ORDER[currentIndex - 1] : null;
};

// 获取断点的下一个更小的断点
export const getNextBreakpointDown = (breakpoint: BreakpointType): BreakpointType | null => {
  const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
  return currentIndex < BREAKPOINT_ORDER.length - 1 ? BREAKPOINT_ORDER[currentIndex + 1] : null;
};

// 默认配置导出（用于插件等外部配置）
export const DEFAULT_BREAKPOINT_CONFIG = {
  breakpoints: BREAKPOINTS,
  defaultBreakpoint: 'lg' as BreakpointType,
  fallbackOrder: BREAKPOINT_FALLBACK_ORDER,
} as const;

// 类型导出
export type DeviceType = keyof typeof DEVICE_ALIASES;
export type MediaQueryType = 'min' | 'max' | 'only';
export type BreakpointRange = (typeof BREAKPOINT_RANGES)[BreakpointType];

// 常用断点组合
export const COMMON_BREAKPOINT_GROUPS = {
  mobile: ['sm'] as BreakpointType[],
  tablet: ['md'] as BreakpointType[],
  desktop: ['lg', 'xl', 'xxl'] as BreakpointType[],
  small: ['sm', 'md'] as BreakpointType[],
  large: ['lg', 'xl', 'xxl'] as BreakpointType[],
} as const;
