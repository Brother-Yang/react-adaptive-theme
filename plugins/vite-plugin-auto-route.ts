import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface RouteConfig {
  path: string;
  name: string;
  component: string;
  autoRoute: boolean;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    icon?: string;
    [key: string]: any;
  };
}

interface RouteWithPageName extends RouteConfig {
  _pageName: string;
  _fullPath: string;
  children?: RouteWithPageName[];
}

interface AutoRouteOptions {
  pagesDir?: string;
  outputFile?: string;
  routeConfigName?: string;
}

export default function autoRoutePlugin(options: AutoRouteOptions = {}): Plugin {
  const {
    pagesDir = 'src/pages',
    outputFile = 'src/router/auto-routes.ts',
    routeConfigName = 'route.json',
  } = options;

  let root = '';

  return {
    name: 'vite-plugin-auto-route',
    configResolved(config) {
      root = config.root;
    },
    buildStart() {
      // 在构建开始时生成路由
      generateRoutes();
    },
    handleHotUpdate({ file }) {
      // 监听route.json文件变化，热更新路由
      if (file.includes(routeConfigName)) {
        generateRoutes();
      }
    },
    configureServer(server) {
      // 开发模式下监听文件变化
      const pagesPath = path.resolve(root, pagesDir);
      server.watcher.add(pagesPath);

      server.watcher.on('change', file => {
        if (file.includes(routeConfigName)) {
          generateRoutes();
          server.ws.send({
            type: 'full-reload',
          });
        }
      });
    },
  };

  function scanPagesDirectory(dirPath: string, parentPath: string): RouteWithPageName[] {
    const routes: RouteWithPageName[] = [];

    const pageDirs = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    pageDirs.forEach((pageName: string) => {
      const pageDir = path.join(dirPath, pageName);
      const routeFile = path.join(pageDir, routeConfigName);

      if (fs.existsSync(routeFile)) {
        try {
          const routeContent = fs.readFileSync(routeFile, 'utf-8');
          const routeConfig: RouteConfig = JSON.parse(routeContent);

          // 只处理开启自动路由的配置
          if (routeConfig.autoRoute) {
            // 检查组件文件是否存在
            const componentFilePath = path.resolve(
              pageDir,
              routeConfig.component.replace('./', '')
            );
            if (!fs.existsSync(componentFilePath)) {
              throw new Error(`🚫 路由配置错误: 组件文件不存在
              
路由文件: ${routeFile}
组件路径: ${routeConfig.component}
实际路径: ${componentFilePath}

💡 解决方案:
1. 检查 route.json 中的 "component" 路径是否正确
2. 确保组件文件确实存在于指定位置
3. 常见的组件文件名: index.tsx, index.jsx`);
            }

            // 构建组件导入路径
            const componentPath = path
              .relative(path.dirname(path.resolve(root, outputFile)), componentFilePath)
              .replace(/\\/g, '/');

            // 构建完整路径
            const fullPath = parentPath ? `${parentPath}/${pageName}` : pageName;

            // 递归扫描子目录
            const childRoutes = scanPagesDirectory(pageDir, fullPath);

            const routeWithPageName: RouteWithPageName = {
              ...routeConfig,
              component: componentPath,
              _pageName: pageName,
              _fullPath: fullPath,
              children: childRoutes.length > 0 ? childRoutes : undefined,
            };

            routes.push(routeWithPageName);
          }
        } catch (error) {
          console.warn(`解析路由配置文件失败: ${routeFile}`, error);
          throw error;
        }
      } else {
        // 如果没有route.json文件，仍然递归扫描子目录
        const childRoutes = scanPagesDirectory(
          pageDir,
          parentPath ? `${parentPath}/${pageName}` : pageName
        );
        routes.push(...childRoutes);
      }
    });

    return routes;
  }

  function validateRouteUniqueness(routes: RouteWithPageName[]): void {
    const allRoutes = collectAllRoutes(routes);
    const pathMap = new Map<string, string[]>();
    const nameMap = new Map<string, string[]>();

    // 收集所有路径和名称
    allRoutes.forEach(route => {
      const routeSource = `${route._fullPath}/route.json`;

      // 检查路径唯一性
      if (!pathMap.has(route.path)) {
        pathMap.set(route.path, []);
      }
      pathMap.get(route.path)!.push(routeSource);

      // 检查名称唯一性
      if (!nameMap.has(route.name)) {
        nameMap.set(route.name, []);
      }
      nameMap.get(route.name)!.push(routeSource);
    });

    // 检查路径冲突
    const pathConflicts: string[] = [];
    pathMap.forEach((sources, path) => {
      if (sources.length > 1) {
        pathConflicts.push(`路径 "${path}" 在以下文件中重复定义:\n  ${sources.join('\n  ')}`);
      }
    });

    // 检查名称冲突
    const nameConflicts: string[] = [];
    nameMap.forEach((sources, name) => {
      if (sources.length > 1) {
        nameConflicts.push(`名称 "${name}" 在以下文件中重复定义:\n  ${sources.join('\n  ')}`);
      }
    });

    // 如果有冲突，抛出错误
    if (pathConflicts.length > 0 || nameConflicts.length > 0) {
      const errorMessage = [
        '🚫 路由配置冲突检测到以下问题:',
        '',
        ...pathConflicts,
        pathConflicts.length > 0 && nameConflicts.length > 0 ? '' : null,
        ...nameConflicts,
        '',
        '💡 解决方案:',
        '1. 确保每个 route.json 中的 "path" 值在全局范围内唯一',
        '2. 确保每个 route.json 中的 "name" 值在全局范围内唯一',
        '3. 对于嵌套路由，子路由的 path 会与父路由组合，请注意避免冲突',
      ]
        .filter(item => item !== null)
        .join('\n');

      throw new Error(errorMessage);
    }
  }

  function generateRoutes() {
    try {
      const pagesPath = path.resolve(root, pagesDir);
      const routes: RouteWithPageName[] = [];

      // 扫描pages目录下的所有文件夹
      if (!fs.existsSync(pagesPath)) {
        console.warn(`Pages目录不存在: ${pagesPath}`);
        return;
      }

      // 递归扫描页面目录
      const scannedRoutes = scanPagesDirectory(pagesPath, '');
      routes.push(...scannedRoutes);

      // 验证路由唯一性
      validateRouteUniqueness(routes);

      // 生成路由文件内容
      const routeFileContent = generateRouteFileContent(routes);

      // 确保输出目录存在
      const outputPath = path.resolve(root, outputFile);
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 写入路由文件
      fs.writeFileSync(outputPath, routeFileContent, 'utf-8');

      console.log(`✅ 自动生成路由配置完成，共 ${routes.length} 个路由`);
    } catch (error) {
      console.error('生成自动路由失败:', error);
      throw error; // 重新抛出错误，确保构建过程停止
    }
  }

  function generateRouteFileContent(routes: RouteWithPageName[]): string {
    // 收集所有需要导入的组件
    const allRoutes = collectAllRoutes(routes);

    // 生成导入语句
    const imports = allRoutes
      .map(route => `import ${route._pageName} from '../pages/${route._fullPath}';`)
      .join('\n');

    // 生成路由配置
    const routeConfigs = generateRouteConfigs(routes, 1);

    return `// 此文件由 vite-plugin-auto-route 自动生成，请勿手动修改
import React from 'react';

${imports}

export const autoRoutes = [
${routeConfigs}
];

export default autoRoutes;
`;
  }

  function collectAllRoutes(routes: RouteWithPageName[]): RouteWithPageName[] {
    const allRoutes: RouteWithPageName[] = [];

    routes.forEach(route => {
      allRoutes.push(route);
      if (route.children && route.children.length > 0) {
        allRoutes.push(...collectAllRoutes(route.children));
      }
    });

    return allRoutes;
  }

  function generateRouteConfigs(routes: RouteWithPageName[], indent: number): string {
    const indentStr = '  '.repeat(indent);

    return routes
      .map(route => {
        const metaStr = route.meta
          ? JSON.stringify(route.meta, null, 4).replace(/\n/g, `\n${indentStr}    `)
          : 'undefined';

        let config = `${indentStr}{
${indentStr}  path: '${route.path}',
${indentStr}  element: React.createElement(${route._pageName}),
${indentStr}  handle: {
${indentStr}    name: '${route.name}',
${indentStr}    meta: ${metaStr}
${indentStr}  }`;

        if (route.children && route.children.length > 0) {
          const childConfigs = generateRouteConfigs(route.children, indent + 1);
          config += `,\n${indentStr}  children: [\n${childConfigs}\n${indentStr}  ]`;
        }

        config += `\n${indentStr}}`;
        return config;
      })
      .join(',\n');
  }
}
