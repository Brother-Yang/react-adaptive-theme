import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import './index.less';

/**
 * 路由进度条组件
 * - 基于 React Router 的 useNavigation 状态
 * - 无第三方依赖，轻量实现 0→90% 的加载动画，完成后冲到 100%
 * - 适配主题，使用 CSS 变量 `--base-color-primary`
 */
const RouterProgressBar: React.FC = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const state = navigation.state;

    // 开始加载：显示并缓慢推进到 90%
    if (state === 'loading') {
      setVisible(true);
      setProgress(0);

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      timerRef.current = window.setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.random() * 10; // 随机推进，提升真实感
          return Math.min(next, 90);
        });
      }, 180);
    }

    // 完成加载：冲到 100%，短暂展示后隐藏
    if (state === 'idle') {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setProgress(100);
      const hideTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        window.clearTimeout(hideTimer);
      }, 260);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigation.state]);

  // 作为兜底：当没有使用 loader 时，基于 location 变化也给到轻量进度反馈
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return; // 首次渲染不显示
    }

    // 若当前已有 navigation loading，则以 navigation 为准
    if (navigation.state === 'loading') return;

    // 显示并快速推进，随后自动完成
    setVisible(true);
    setProgress(0);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        const next = prev + 25; // 更快推进，适配无 loader 的短反馈
        return Math.min(next, 90);
      });
    }, 100);

    const doneTimer = window.setTimeout(() => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setProgress(100);
      const hideTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        window.clearTimeout(hideTimer);
      }, 240);
      window.clearTimeout(doneTimer);
    }, 400);

    return () => {
      window.clearTimeout(doneTimer);
    };
  }, [location.key]);

  return (
    <div className={`router-progress ${visible ? 'visible' : ''}`} aria-hidden={!visible}>
      <div className='router-progress-bar' style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
};

export default RouterProgressBar;
