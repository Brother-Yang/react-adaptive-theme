import React, { useMemo } from 'react';
import { Breadcrumb, type BreadcrumbProps } from 'antd';
import { Link, useMatches } from 'react-router-dom';

// 为路由 handle 定义最小可用类型以安全读取 meta.title
interface RouteHandleMeta {
  meta?: {
    title?: string;
  };
}

interface MatchMeta {
  pathname: string;
  handle?: RouteHandleMeta;
}

interface BreadcrumbsProps {
  className?: string;
  compact?: boolean; // 仅显示末尾2个
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, compact = false }) => {
  const matches = useMatches();

  const items = useMemo<BreadcrumbProps['items']>(() => {
    // 去重，避免根容器与首页匹配都为 '/'
    const deduped: MatchMeta[] = [];
    const seen = new Set<string>();
    for (const m of matches as MatchMeta[]) {
      const p = m.pathname || '/';
      if (!seen.has(p)) {
        seen.add(p);
        deduped.push(m);
      }
    }

    const list = deduped.map((m, i) => {
      const p = m.pathname || '/';
      const routeTitle = m.handle?.meta?.title;
      const titleText = routeTitle
        ? $tAuto(routeTitle)
        : p === '/'
        ? $tAuto('首页')
        : p.split('/').filter(Boolean).pop() || '';

      return {
        key: `${p}-${i}`,
        title: <Link to={p}>{titleText}</Link>,
      };
    });

    if (compact && list.length > 2) {
      return list.slice(list.length - 2);
    }
    return list;
  }, [matches, compact]);

  return <Breadcrumb className={className} items={items} />;
};

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
