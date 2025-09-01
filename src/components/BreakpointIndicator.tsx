import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBreakpoint, type BreakpointType } from '../hooks/useBreakpoint';
import './BreakpointIndicator.less';

// 断点颜色映射（按照插件配置）
const BREAKPOINT_COLORS: Record<BreakpointType, string> = {
  sm: 'orange',   // Small - 橙色 (0-576px)
  md: 'gold',     // Medium - 金色 (576-768px)
  lg: 'blue',     // Large - 蓝色 (768-992px)
  xl: 'purple',   // Extra Large - 紫色 (992-1200px)
  xxl: 'magenta'  // Extra Extra Large - 品红色 (1200px+)
};

// 断点图标映射
const BREAKPOINT_ICONS: Record<BreakpointType, string> = {
  sm: '📱',  // 手机设备
  md: '📱',  // 平板
  lg: '💻',  // 桌面
  xl: '🖥️',  // 大屏桌面
  xxl: '🖥️'  // 超大屏桌面
};

// 获取断点名称的函数
const getBreakpointName = (breakpoint: BreakpointType, t: (key: string) => string): string => {
  const nameMap: Record<BreakpointType, string> = {
    sm: t('breakpoint.mobile'),
    md: t('breakpoint.tablet'),
    lg: t('breakpoint.desktop'),
    xl: t('breakpoint.largeDesktop'),
    xxl: t('breakpoint.extraLargeDesktop')
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
  clickable = true
}) => {
  const { t } = useTranslation();
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
      <Tag 
        color={BREAKPOINT_COLORS[breakpoint.current]}
        className="breakpoint-tag"
      >
        <span className="breakpoint-icon">
          {BREAKPOINT_ICONS[breakpoint.current]}
        </span>
        <span className="breakpoint-name">
          {getBreakpointName(breakpoint.current, t)}
        </span>
      </Tag>
      
      {showDetailInfo && (
        <div className="breakpoint-details">
          <div className="detail-item">
            <span className="detail-label">{t('breakpoint.current')}:</span>
            <span className="detail-value">{breakpoint.current.toUpperCase()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('breakpoint.device')}:</span>
            <span className="detail-value">{getBreakpointName(breakpoint.current, t)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('breakpoint.width')}:</span>
            <span className="detail-value">{breakpoint.width}px</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('breakpoint.height')}:</span>
            <span className="detail-value">{breakpoint.height}px</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('breakpoint.ratio')}:</span>
            <span className="detail-value">
              {(breakpoint.width / breakpoint.height).toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {clickable && (
        <div className="click-hint">
          {showDetailInfo ? t('breakpoint.clickToCollapse') : t('breakpoint.clickToExpand')}
        </div>
      )}
    </div>
  );
};

export default BreakpointIndicator;