import React, { useState, useEffect, useTransition, useOptimistic } from 'react';
import type { ReactNode } from 'react';
import { THEME_STORAGE_KEY, type ThemeMode, themeConfigs, applyBaseTheme } from '../config/theme';
import { ThemeContext, type ThemeContextType } from './ThemeContextDefinition';

/**
 * 动态添加 View Transition 相关的 CSS 样式
 *
 * 这个函数会在页面加载时动态创建并插入必要的 CSS 样式
 * 用于控制 View Transition API 的伪元素行为和层级关系
 */
function injectViewTransitionStyles(): void {
  // 检查是否已经添加过样式，避免重复添加
  if (document.getElementById('view-transition-styles')) {
    return;
  }

  // 创建 style 元素
  const style = document.createElement('style');
  style.id = 'view-transition-styles';

  // 定义 View Transition 相关的 CSS 样式
  style.textContent = `
    /* 禁用默认的 View Transition 动画，使用自定义动画 */
    ::view-transition-new(theme-switch),
    ::view-transition-old(theme-switch) {
      animation: none;
      mix-blend-mode: normal;
    }

    /* 默认情况下，旧状态在下层，新状态在上层 */
    ::view-transition-old(theme-switch) {
      z-index: 1;
    }

    ::view-transition-new(theme-switch) {
      z-index: 9999;
    }

    /* 深色主题时反转层级关系，实现不同的视觉效果 */
    html.dark::view-transition-old(theme-switch) {
      z-index: 9999;
    }

    html.dark::view-transition-new(theme-switch) {
      z-index: 1;
    }
  `;

  // 将样式添加到 head 中
  document.head.appendChild(style);
}

/**
 * 计算从点击位置到屏幕边缘的最大距离
 *
 * 这个函数用于计算涟漪动画需要的最大半径，确保动画能够覆盖整个屏幕
 * 使用勾股定理计算从点击点到屏幕四个角的最大距离
 *
 * @param x 点击位置的 x 坐标（相对于视口）
 * @param y 点击位置的 y 坐标（相对于视口）
 * @returns 涟漪动画需要的最大半径（像素）
 */
function computeMaxRadius(x: number, y: number): number {
  // Math.max(x, innerWidth - x) 计算 x 坐标到左右边缘的最大距离
  // Math.max(y, innerHeight - y) 计算 y 坐标到上下边缘的最大距离
  // Math.hypot() 使用勾股定理计算两点间的直线距离，确保圆形动画能覆盖整个屏幕
  return Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
}

/**
 * 检查浏览器是否支持 View Transition API
 *
 * View Transition API 是现代浏览器提供的原生页面过渡动画 API
 * 它允许在 DOM 状态变化时创建平滑的视觉过渡效果
 * 同时检查用户是否启用了减少动画的偏好设置
 *
 * @returns 是否支持且用户允许使用 View Transition API
 */
function isViewTransitionSupported(): boolean {
  return Boolean(
    // 检查浏览器是否支持 View Transition API
    'startViewTransition' in document &&
      // 检查用户是否设置了减少动画的偏好（无障碍功能）
      // 如果用户设置了 prefers-reduced-motion: reduce，则不使用动画
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
}

/**
 * 设置主题类名
 *
 * 通过切换 HTML 根元素的 'dark' 类名来控制整个应用的主题
 * 这是实现主题切换的核心机制，CSS 会根据这个类名应用不同的样式
 *
 * @param isDark 是否为深色主题
 */
function setupThemeClass(isDark: boolean): void {
  // 在 HTML 根元素上切换 'dark' 类名
  // 当 isDark 为 true 时添加 'dark' 类，为 false 时移除
  document.documentElement.classList.toggle('dark', isDark);
}

// 主题提供者组件Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 获取初始主题
const getInitialTheme = (): ThemeMode => {
  // 优先从localStorage获取
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme;
  }

  // 其次检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 默认亮色主题
  return 'light';
};

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [isPending, startTransition] = useTransition();

  // 使用 useOptimistic 来提供即时的视觉反馈
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    themeMode,
    (_currentTheme: ThemeMode, newTheme: ThemeMode) => newTheme,
  );

  // 在组件初始化时注入 View Transition 样式
  useEffect(() => {
    injectViewTransitionStyles();
  }, []);

  /**
   * 执行主题更新的核心逻辑
   * 包含乐观更新和实际状态更新
   */
  const executeThemeUpdate = (newTheme: ThemeMode) => {
    // 立即更新乐观状态，提供即时视觉反馈
    setOptimisticTheme(newTheme);

    // 在 transition 中执行实际的状态更新
    startTransition(() => {
      setThemeMode(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  };

  // 切换主题函数 - 使用 useTransition 优化性能，支持涟漪动画
  const toggleTheme = (event?: React.MouseEvent) => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';

    // 如果提供了事件参数且浏览器支持 View Transition API，则使用涟漪动画
    if (event && isViewTransitionSupported()) {
      triggerThemeRipple(event, themeMode === 'dark', () => {
        executeThemeUpdate(newTheme);
      });
    } else {
      // 没有事件参数或不支持动画时，直接切换主题
      executeThemeUpdate(newTheme);
    }
  };

  /**
   * 触发主题切换的涟漪动画
   *
   * 这是整个涟漪效果的核心函数，使用 View Transition API 创建平滑的主题切换动画
   * 动画效果是从点击位置开始的圆形扩散或收缩，模拟涟漪效果
   *
   * @param event React 鼠标事件，用于获取点击位置
   * @param currentIsDark 当前是否为深色主题
   * @param onThemeChange 主题切换的回调函数
   */
  function triggerThemeRipple(
    event: React.MouseEvent,
    currentIsDark: boolean,
    onThemeChange: () => void,
  ): void {
    // 如果浏览器不支持 View Transition API 或用户禁用了动画
    // 则直接执行主题切换，不显示动画效果
    if (!isViewTransitionSupported()) {
      onThemeChange();
      return;
    }

    // 获取鼠标点击的屏幕坐标（相对于视口）
    const { clientX: x, clientY: y } = event;
    // 计算涟漪动画需要的最大半径，确保能覆盖整个屏幕
    const endRadius = computeMaxRadius(x, y);
    // 计算切换后的主题状态
    const newIsDark = !currentIsDark;

    // 定义 clipPath 动画的关键帧
    // clipPath 用于裁剪元素的可见区域，这里用圆形裁剪创建涟漪效果
    // 第一个值是起始状态（小圆），第二个值是结束状态（大圆）
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    // 根据主题切换方向决定动画方向
    // 切换到深色主题时使用收缩效果（从大圆到小圆）
    // 切换到浅色主题时使用扩散效果（从小圆到大圆）
    if (newIsDark) {
      clipPath.reverse(); // 反转数组，实现收缩效果
    }

    /**
     * document.startViewTransition() 的作用：
     *
     * 1. 这是 View Transition API 的核心方法，用于创建页面状态变化的过渡动画
     * 2. 它会自动捕获 DOM 变化前后的快照，并创建伪元素来实现过渡效果
     * 3. 在回调函数中执行的 DOM 更改会被包装在一个过渡动画中
     * 4. 返回一个 ViewTransition 对象，包含 ready、updateCallbackDone、finished 等 Promise
     *
     * 为什么要这样使用：
     * - 提供了原生的、高性能的页面过渡动画支持
     * - 自动处理复杂的 DOM 状态管理和动画同步
     * - 比手动实现的 CSS 动画更流畅，性能更好
     * - 支持复杂的页面布局变化动画
     */
    document
      .startViewTransition(() => {
        // 在这个回调函数中执行实际的主题切换逻辑
        // View Transition API 会自动捕获这个变化并创建过渡动画
        onThemeChange();
      })
      .ready.then(() => {
        /**
         * document.documentElement.animate() 的作用：
         *
         * 1. 这是 Web Animations API 的方法，用于创建和控制动画
         * 2. 在 View Transition 的伪元素上应用自定义的 clipPath 动画
         * 3. 通过 pseudoElement 参数指定动画应用到哪个伪元素上
         *
         * 为什么要这样使用：
         * - View Transition API 会自动创建 ::view-transition-old(theme-switch) 和 ::view-transition-new(theme-switch) 伪元素
         * - 这些伪元素分别代表变化前和变化后的页面快照
         * - 通过在这些伪元素上应用 clipPath 动画，可以创建自定义的过渡效果
         * - clipPath 的圆形裁剪配合坐标位置，实现了从点击位置开始的涟漪扩散效果
         *
         * pseudoElement 的选择逻辑：
         * - 切换到深色主题时，在 ::view-transition-old(theme-switch)（旧状态）上应用动画
         * - 切换到浅色主题时，在 ::view-transition-new(theme-switch)（新状态）上应用动画
         * - 这样可以确保动画效果与主题切换方向保持一致
         */
        document.documentElement.animate(
          {
            // clipPath 属性定义了元素的裁剪路径
            // 这里使用圆形裁剪，从点击位置开始扩散或收缩
            clipPath,
          },
          {
            duration: 450, // 动画持续时间（毫秒）
            easing: 'ease-in', // 动画缓动函数，开始慢后来快
            // 指定动画应用到哪个伪元素上
            // 根据主题切换方向选择不同的伪元素，实现不同的视觉效果
            pseudoElement: newIsDark
              ? '::view-transition-old(theme-switch)'
              : '::view-transition-new(theme-switch)',
          },
        );
      });
  }

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置过主题时才跟随系统
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 应用主题变化 - 使用乐观主题进行即时更新
  useEffect(() => {
    // 设置主题类名到 document.documentElement
    setupThemeClass(optimisticTheme === 'dark');
    // 应用基础主题CSS变量
    applyBaseTheme(themeConfigs[optimisticTheme]);
  }, [optimisticTheme]);

  const contextValue: ThemeContextType = {
    themeMode: optimisticTheme, // 使用乐观主题提供即时反馈
    toggleTheme,
    isDark: optimisticTheme === 'dark',
    isPending, // 提供加载状态给组件使用
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
