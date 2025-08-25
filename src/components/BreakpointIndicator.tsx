import React from 'react';
import { Tag } from 'antd';
import { useBreakpoint, type BreakpointType } from '../hooks/useBreakpoint';
import './BreakpointIndicator.less';

// 断点颜色映射
const BREAKPOINT_COLORS: Record<BreakpointType, string> = {
  mobile: 'green',
  pad: 'orange', 
  pc: 'blue'
};

// 断点图标映射
const BREAKPOINT_ICONS: Record<BreakpointType, string> = {
  mobile: '📱',
  pad: '📱',
  pc: '💻'
};

// 断点名称映射
const BREAKPOINT_NAMES: Record<BreakpointType, string> = {
  mobile: 'Mobile',
  pad: 'Tablet',
  pc: 'Desktop'
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
          {BREAKPOINT_NAMES[breakpoint.current]}
        </span>
      </Tag>
      
      {showDetailInfo && (
        <div className="breakpoint-details">
          <div className="detail-item">
            <span className="detail-label">断点:</span>
            <span className="detail-value">{breakpoint.current}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">宽度:</span>
            <span className="detail-value">{breakpoint.width}px</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">高度:</span>
            <span className="detail-value">{breakpoint.height}px</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">比例:</span>
            <span className="detail-value">
              {(breakpoint.width / breakpoint.height).toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {clickable && (
        <div className="click-hint">
          {showDetailInfo ? '点击收起' : '点击展开'}
        </div>
      )}
    </div>
  );
};

export default BreakpointIndicator;