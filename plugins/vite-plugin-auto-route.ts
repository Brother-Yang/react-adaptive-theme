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
            // 构建组件导入路径
            const componentPath = path
              .relative(
                path.dirname(path.resolve(root, outputFile)),
                path.resolve(pageDir, routeConfig.component.replace('./', ''))
              )
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
