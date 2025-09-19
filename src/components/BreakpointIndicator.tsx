import React from 'react';
import { Tag } from 'antd';
import { useBreakpoint, type BreakpointType } from '../hooks/useBreakpoint';
import './BreakpointIndicator.less';

// 断点颜色映射（按照插件配置）
const BREAKPOINT_COLORS: Record<BreakpointType, string> = {
  sm: 'orange', // Small - 橙色 (0-576px)
  md: 'gold', // Medium - 金色 (576-768px)
  lg: 'blue', // Large - 蓝色 (768-992px)
  xl: 'purple', // Extra Large - 紫色 (992-1200px)
  xxl: 'magenta', // Extra Extra Large - 品红色 (1200px+)
};

// 断点图标映射
const BREAKPOINT_ICONS: Record<BreakpointType, string> = {
  sm: '📱', // 手机设备
  md: '📱', // 平板
  lg: '💻', // 桌面
  xl: '🖥️', // 大屏桌面
  xxl: '🖥️', // 超大屏桌面
};

// 获取断点名称的函数
const getBreakpointName = (breakpoint: BreakpointType): string => {
  const nameMap: Record<BreakpointType, string> = {
    sm: $tAuto('移动设备'),
    md: $tAuto('平板设备'),
    lg: $tAuto('桌面设备'),
    xl: $tAuto('大屏桌面'),
    xxl: $tAuto('超大屏桌面'),
  };
  return nameMap[breakpoint];
};

interface BreakpointIndicatorProps {
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 是否可点击切换详细信息 */
  clickable?: boolean;
}

/**
 * 断点指示器组件
 * 显示当前设备断点信息
 */
export const BreakpointIndicator: React.FC<BreakpointIndicatorProps> = ({
  showDetails = false,
  className = '',
  clickable = true,
}) => {
  const breakpoint = useBreakpoint();
  const [showDetailInfo, setShowDetailInfo] = React.useState(showDetails);

  const handleClick = () => {
    if (clickable) {
      setShowDetailInfo(!showDetailInfo);
    }
  };

  return (
    <div
      className={`breakpoint-indicator ${className}`}
      onClick={handleClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <Tag color={BREAKPOINT_COLORS[breakpoint.current]} className='breakpoint-tag'>
        <span className='breakpoint-icon'>{BREAKPOINT_ICONS[breakpoint.current]}</span>
        <span className='breakpoint-name'>{getBreakpointName(breakpoint.current)}</span>
      </Tag>

      {showDetailInfo && (
        <div className='breakpoint-details'>
          <div className='detail-item'>
            <span className='detail-label'>{$tAuto('当前断点')}:</span>
            <span className='detail-value'>{breakpoint.current.toUpperCase()}</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>{$tAuto('设备类型')}:</span>
            <span className='detail-value'>{getBreakpointName(breakpoint.current)}</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>{$tAuto('屏幕宽度')}:</span>
            <span className='detail-value'>{breakpoint.width}px</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>{$tAuto('屏幕高度')}:</span>
            <span className='detail-value'>{breakpoint.height}px</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>{$tAuto('宽高比')}:</span>
            <span className='detail-value'>
              {(breakpoint.width / breakpoint.height).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {clickable && (
        <div className='click-hint'>{showDetailInfo ? $tAuto('点击收起') : $tAuto('点击展开')}</div>
      )}
    </div>
  );
};

export default BreakpointIndicator;
