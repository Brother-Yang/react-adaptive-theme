/**
 * 性能监控工具
 * 收集和分析应用性能指标
 */

// Web Vitals 指标类型
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
}

// 性能指标数据
export interface PerformanceMetrics {
  // 页面加载性能
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // 资源加载性能
  resourceCount: number;
  totalResourceSize: number;

  // 内存使用情况
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };

  // 网络信息
  connectionType?: string;
  effectiveType?: string;

  // 用户代理信息
  userAgent: string;
  timestamp: number;
}

// 性能监控类
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled = false;

  /**
   * 启用性能监控
   */
  enable(): void {
    if (this.isEnabled || typeof window === 'undefined') return;

    this.isEnabled = true;
    this.setupObservers();
    this.collectInitialMetrics();
  }

  /**
   * 禁用性能监控
   */
  disable(): void {
    if (!this.isEnabled) return;

    this.isEnabled = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * 设置性能观察器
   */
  private setupObservers(): void {
    // 观察导航时间
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              this.handleNavigationEntry(entry as PerformanceNavigationTiming);
            }
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation observer not supported:', error);
      }

      // 观察资源加载
      try {
        const resourceObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'resource') {
              this.handleResourceEntry(entry);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }
    }
  }

  /**
   * 收集初始性能指标
   */
  private collectInitialMetrics(): void {
    if (typeof window === 'undefined') return;

    // 等待页面加载完成后收集指标
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectMetrics(), 0);
      });
    }
  }

  /**
   * 收集性能指标
   */
  private collectMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    const metrics: PerformanceMetrics = {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      domContentLoaded: navigation
        ? navigation.domContentLoadedEventEnd - navigation.fetchStart
        : 0,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      resourceCount: resources.length,
      totalResourceSize: resources.reduce((total, resource) => {
        const resourceTiming = resource as PerformanceResourceTiming;
        return total + (resourceTiming.transferSize || 0);
      }, 0),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };

    // 收集内存使用情况（如果支持）
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }

    // 收集网络信息（如果支持）
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      metrics.connectionType = connection.type;
      metrics.effectiveType = connection.effectiveType;
    }

    this.metrics.push(metrics);
    this.reportMetrics(metrics);
  }

  /**
   * 处理导航条目
   */
  private handleNavigationEntry(entry: PerformanceNavigationTiming): void {
    // 可以在这里处理特定的导航性能数据
    console.debug('Navigation performance:', {
      loadTime: entry.loadEventEnd - entry.fetchStart,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.fetchStart,
      firstByte: entry.responseStart - entry.fetchStart,
    });
  }

  /**
   * 处理资源条目
   */
  private handleResourceEntry(entry: PerformanceEntry): void {
    // 监控大型资源加载
    const resourceEntry = entry as PerformanceResourceTiming;
    if (resourceEntry.transferSize && resourceEntry.transferSize > 100000) {
      // 100KB
      console.debug('Large resource detected:', {
        name: entry.name,
        size: resourceEntry.transferSize,
        duration: entry.duration,
      });
    }
  }

  /**
   * 报告性能指标
   */
  private reportMetrics(metrics: PerformanceMetrics): void {
    // 在开发环境下输出到控制台
    if (import.meta.env.DEV) {
      console.group('🚀 Performance Metrics');
      console.log('Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
      console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`);
      console.log('First Paint:', `${metrics.firstPaint.toFixed(2)}ms`);
      console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
      console.log('Resource Count:', metrics.resourceCount);
      console.log('Total Resource Size:', `${(metrics.totalResourceSize / 1024).toFixed(2)}KB`);

      if (metrics.memoryUsage) {
        console.log(
          'Memory Usage:',
          `${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
        );
      }

      if (metrics.connectionType) {
        console.log('Connection:', `${metrics.connectionType} (${metrics.effectiveType})`);
      }

      console.groupEnd();
    }

    // 在生产环境下可以发送到分析服务
    // this.sendToAnalytics(metrics);
  }

  /**
   * 获取所有收集的指标
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 获取最新的指标
   */
  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  /**
   * 清除所有指标
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * 手动记录自定义性能指标
   */
  mark(name: string): void {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  }

  /**
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn('Performance measure failed:', error);
        return 0;
      }
    }
    return 0;
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// Web Vitals 集成（如果需要更详细的指标）
export function reportWebVitals(onPerfEntry?: (metric: WebVitalsMetric) => void): void {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // 这里可以集成 web-vitals 库
    // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //   getCLS(onPerfEntry);
    //   getFID(onPerfEntry);
    //   getFCP(onPerfEntry);
    //   getLCP(onPerfEntry);
    //   getTTFB(onPerfEntry);
    // });
  }
}

// 导出工具函数
export { PerformanceMonitor };
