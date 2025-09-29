import React, { createContext, useContext } from 'react';
import './GridLayout.less';

// GridLayout Context 接口
interface GridLayoutContextValue {
  labelWidth?: string | number;
  valueWidth?: 'auto' | 'fill' | string | number;
}

// 创建 Context
const GridLayoutContext = createContext<GridLayoutContextValue | undefined>(undefined);

export interface GridLayoutItem {
  label: React.ReactNode;
  value: React.ReactNode;
  span?: number; // 跨列数，默认为1
  alignItems?: 'flex-start' | 'center' | 'flex-end'; // 对齐方式：上对齐、居中对齐、下对齐
}

// Label组件接口
export interface GridLayoutLabelProps {
  children: React.ReactNode;
  width?: string | number;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Value组件接口
export interface GridLayoutValueProps {
  children: React.ReactNode;
  span?: number; // 跨列数，默认为1
  width?: 'auto' | 'fill' | string | number; // 宽度设置
  className?: string;
  style?: React.CSSProperties;
}

export interface GridLayoutProps {
  items: GridLayoutItem[];
  columns?: number; // 列数，默认为3
  direction?: 'horizontal' | 'vertical'; // 布局方向，默认为horizontal
  gap?: string | number; // 间距，默认为16px
  className?: string;
  labelWidth?: string | number; // 统一的label宽度，GridLayoutLabel中的width可以覆盖此设置
  valueWidth?: 'auto' | 'fill' | string | number; // 统一的value宽度，GridLayoutValue中的width可以覆盖此设置
  alignItems?: 'flex-start' | 'center' | 'flex-end'; // 统一的对齐方式，GridLayoutItem中的alignItems可以覆盖此设置
}

const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  columns = 3,
  direction = 'horizontal',
  gap = 16,
  className,
  labelWidth,
  valueWidth,
  alignItems,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
  };

  const contextValue: GridLayoutContextValue = {
    labelWidth,
    valueWidth,
  };

  return (
    <GridLayoutContext.Provider value={contextValue}>
      <div className={`grid-layout ${direction} ${className || ''}`} style={containerStyle}>
        {items.map((item, index) => {
          const itemStyle: React.CSSProperties = {
            alignItems: item.alignItems ?? alignItems,
          };

          return (
            <div key={index} className='grid-layout__item' style={itemStyle}>
              {item.label}
              {item.value}
            </div>
          );
        })}
      </div>
    </GridLayoutContext.Provider>
  );
};

// Label子组件
const GridLayoutLabel: React.FC<GridLayoutLabelProps> = ({
  children,
  width,
  required = false,
  className = '',
  style = {},
}) => {
  const context = useContext(GridLayoutContext);
  const finalWidth = width ?? context?.labelWidth;

  const labelStyle: React.CSSProperties = {
    ...style,
  };

  if (finalWidth) {
    labelStyle.width = typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth;
    labelStyle.minWidth = typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth;
  }

  const labelClassName = `grid-layout__label ${required ? 'required' : ''} ${className}`.trim();

  return (
    <div className={labelClassName} style={labelStyle}>
      {children}
    </div>
  );
};

// Value子组件
const GridLayoutValue: React.FC<GridLayoutValueProps> = ({
  children,
  span = 1,
  width,
  className = '',
  style = {},
}) => {
  const context = useContext(GridLayoutContext);
  const finalWidth = width ?? context?.valueWidth;

  const valueClassName = `grid-layout__value ${className}`.trim();
  const valueStyle: React.CSSProperties = {
    gridColumn: `span ${span}`,
    ...style,
  };

  if (finalWidth) {
    if (finalWidth === 'auto') {
      valueStyle.width = 'auto';
    } else if (finalWidth === 'fill') {
      valueStyle.flex = '1';
    } else {
      valueStyle.width = typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth;
    }
  }

  return (
    <div className={valueClassName} style={valueStyle}>
      {children}
    </div>
  );
};

// 扩展GridLayout组件类型以支持子组件
interface GridLayoutComponent extends React.FC<GridLayoutProps> {
  Label: React.FC<GridLayoutLabelProps>;
  Value: React.FC<GridLayoutValueProps>;
}

// 创建带有子组件的GridLayout
const GridLayoutWithSubComponents = GridLayout as GridLayoutComponent;
GridLayoutWithSubComponents.Label = GridLayoutLabel;
GridLayoutWithSubComponents.Value = GridLayoutValue;

export default GridLayoutWithSubComponents;
