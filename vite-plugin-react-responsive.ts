import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

// 修复 traverse 导入问题
const traverseDefault = typeof traverse === 'function' ? traverse : (traverse as unknown as { default: typeof traverse }).default;

// 默认断点配置
const defaultBreakpoints: Record<string, number> = {
  sm: 576,   // Small devices - 对应插件 Sm
  md: 768,   // Medium devices - 对应插件 Md
  lg: 992,   // Large devices - 对应插件 Lg
  xl: 1200,  // Extra large devices - 对应插件 Xl
  xxl: 1400  // Extra extra large devices - 对应插件 Xxl
};

// 插件配置接口
export interface ReactResponsivePluginOptions {
  breakpoints?: Record<string, number>;
  defaultBreakpoint?: string;
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

// 创建匹配函数
function createMatcher(patterns?: string | RegExp | (string | RegExp)[]) {
  if (!patterns) return () => false;
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];
  return (id: string) => {
    return patternArray.some(pattern => {
      if (typeof pattern === 'string') {
        return id.includes(pattern);
      }
      return pattern.test(id);
    });
  };
}

// 生成动态导入代码
function generateDynamicImport(componentPath: string, breakpoints: Record<string, number>, defaultBreakpoint: string, existingBreakpoints: string[]) {
  // 只为存在的断点文件生成导入
  const importMap = existingBreakpoints.map(bp => {
    // 使用小写断点名称匹配小写文件名格式
    const lowercaseBp = bp.toLowerCase();
    return `${lowercaseBp}: () => import('${componentPath}.${lowercaseBp}')`;
  }).join(',\n    ');
  
  // 生成动态组件代码
  return `
import React, { useMemo, Suspense } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// 默认组件导入
import DefaultComponent from '${componentPath}.${defaultBreakpoint}';

// 动态导入映射（仅包含存在的文件）
const componentMap = {
  ${importMap}
};

// 组件缓存
const componentCache = new Map();

// 响应式组件包装器
const ResponsiveComponent = React.forwardRef((props, ref) => {
  const { current } = useBreakpoint();
  
  const DynamicComponent = useMemo(() => {
    // 检查是否有对应断点的组件
    const breakpointKey = Object.keys(componentMap).find(key => {
      const breakpointValues = ${JSON.stringify(breakpoints)};
      const width = typeof window !== 'undefined' ? window.innerWidth : 1400;
      
      // 根据断点值判断当前应该使用哪个组件
      if (key === 'sm') return width < breakpointValues.sm || (width >= breakpointValues.sm && width < breakpointValues.md);
      if (key === 'md') return width >= breakpointValues.md && width < breakpointValues.lg;
      if (key === 'lg') return width >= breakpointValues.lg && width < breakpointValues.xl;
      if (key === 'xl') return width >= breakpointValues.xl && width < breakpointValues.xxl;
      if (key === 'xxl') return width >= breakpointValues.xxl;
      
      return false;
    });
    
    if (!breakpointKey || !componentMap[breakpointKey]) {
      // 返回默认组件
      return DefaultComponent;
    }
    
    // 检查缓存
    if (componentCache.has(breakpointKey)) {
      return componentCache.get(breakpointKey);
    }
    
    // 动态导入组件
    const LazyComponent = React.lazy(componentMap[breakpointKey]);
    componentCache.set(breakpointKey, LazyComponent);
    
    return LazyComponent;
  }, [current]);
  
  // 如果是默认组件，直接渲染
  if (DynamicComponent === DefaultComponent) {
    return React.createElement(DefaultComponent, { ...props, ref });
  }
  
  // 动态组件需要Suspense包装
  return React.createElement(
    Suspense,
    { fallback: React.createElement(DefaultComponent, { ...props, ref }) },
    React.createElement(DynamicComponent, { ...props, ref })
  );
});

ResponsiveComponent.displayName = 'ResponsiveComponent';

export default ResponsiveComponent;
`;
}

// 检查存在的断点文件
function getExistingBreakpoints(id: string, breakpoints: Record<string, number>) {
  const breakpointKeys = Object.keys(breakpoints);
  const dir = dirname(id);
  const existingBreakpoints: string[] = [];
  
  // 检查每个断点文件是否存在
  for (const bp of breakpointKeys) {
    const lowercaseBp = bp.toLowerCase();
    const bpFile = join(dir, `index.${lowercaseBp}.tsx`);
    const bpFileJs = join(dir, `index.${lowercaseBp}.jsx`);
    if (existsSync(bpFile) || existsSync(bpFileJs)) {
      existingBreakpoints.push(bp);
    }
  }
  
  return existingBreakpoints;
}



// 主插件函数
export default function reactResponsivePlugin(options: ReactResponsivePluginOptions = {}): Plugin {
  const {
    breakpoints = defaultBreakpoints,
    defaultBreakpoint = 'lg',
    include = /\/components\/.*\/index\.(tsx?|jsx?)$/,
    exclude
  } = options;
  
  const shouldInclude = createMatcher(include);
  const shouldExclude = createMatcher(exclude);
  
  return {
    name: 'vite-plugin-react-responsive',
    enforce: 'pre',
    
    transform(code: string, id: string) {
      // 过滤文件
      if (!shouldInclude(id) || shouldExclude(id)) {
        return null;
      }
      
      // 检查存在的断点文件
         const existingBreakpoints = getExistingBreakpoints(id, breakpoints);
         if (existingBreakpoints.length === 0) {
           return null;
         }
      
      try {
        // 解析代码
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx']
        });
        
        let hasDefaultExport = false;
        let shouldTransform = false;
        
        // 遍历AST查找默认导出
         traverseDefault(ast, {
          ExportDefaultDeclaration(path) {
            hasDefaultExport = true;
            
            // 检查是否为React组件
            const declaration = path.node.declaration;
            if (
              t.isIdentifier(declaration) ||
              t.isFunctionDeclaration(declaration) ||
              t.isArrowFunctionExpression(declaration) ||
              t.isFunctionExpression(declaration)
            ) {
              shouldTransform = true;
            }
          },
          
          // 检查是否有React导入
          ImportDeclaration(path) {
            if (path.node.source.value === 'react') {
              shouldTransform = true;
            }
          }
        });
        
        // 如果不需要转换，返回原代码
        if (!hasDefaultExport || !shouldTransform) {
          return null;
        }
        
        // 生成相对路径，直接使用./index作为基础路径
         const relativePath = './index';
        
        // 生成新的代码
          const newCode = generateDynamicImport(relativePath, breakpoints, defaultBreakpoint, existingBreakpoints);
        
        return {
          code: newCode,
          map: null
        };
        
      } catch (error) {
         
        // eslint-disable-next-line no-console
        console.warn(`[vite-plugin-react-responsive] Failed to transform ${id}:`, error);
        return null;
      }
    },
    
    // 配置解析
     configResolved(config) {
       // 确保别名配置正确
       if (!config.resolve.alias) {
         config.resolve.alias = [];
       }
       
       // 添加@别名如果不存在
       const aliasArray = Array.isArray(config.resolve.alias) ? config.resolve.alias : [];
       const hasAtAlias = aliasArray.some(alias => alias.find === '@');
       if (!hasAtAlias) {
         aliasArray.push({ find: '@', replacement: config.root + '/src' });
       }
     },
    
    // 开发服务器配置
    configureServer(server) {
      server.middlewares.use('/responsive-debug', (req: any, res: any, next: () => void) => {
        if (req.url === '/responsive-debug') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            breakpoints,
            defaultBreakpoint,
            plugin: 'vite-plugin-react-responsive'
          }, null, 2));
        } else {
          next();
        }
      });
    }
  };
}

// 导出默认断点配置
export { defaultBreakpoints };