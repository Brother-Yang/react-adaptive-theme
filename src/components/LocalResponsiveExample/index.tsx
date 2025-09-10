import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { useLocalResponsive, useLocalResponsiveText, useLocalResponsiveValue } from '../../hooks/useLocalResponsive';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const LocalResponsiveExample: React.FC = () => {
  // 1. 文本内容的响应式处理
  const title = useLocalResponsiveText({
    sm: '小屏幕',
    md: '中等屏幕',
    lg: '大屏幕',
    xl: '超大屏幕',
    xxl: '超宽屏幕'
  }, '默认标题');

  // 2. 数值的响应式处理（字体大小）
  const fontSize = useLocalResponsiveValue({
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24
  }, 16);

  // 3. 间距的响应式处理
  const spacing = useLocalResponsiveValue({
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  }, 16);

  // 4. 按钮尺寸的响应式处理
  const buttonSize = useLocalResponsive({
    sm: 'small',
    md: 'middle',
    lg: 'middle',
    xl: 'large',
    xxl: 'large'
  }, { defaultContent: 'middle' }) as 'small' | 'middle' | 'large';

  // 5. 复杂内容的响应式处理（React 节点）
  const complexContent = useLocalResponsive({
    md: (
      <div>
        <Paragraph>
          中等屏幕显示更多信息，包括详细的描述文本和多个操作按钮。
        </Paragraph>
        <Space>
          <Button type="primary">主要操作</Button>
          <Button>次要操作</Button>
        </Space>
      </div>
    ),
    lg: (
      <div>
        <Paragraph>
          大屏幕可以显示完整的内容，包括详细描述、多媒体内容和完整的操作面板。
          这里可以放置更多的交互元素和信息展示。
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large">主要操作</Button>
          <Button size="large">次要操作</Button>
          <Button type="dashed" size="large">更多选项</Button>
        </Space>
      </div>
    )
  }, {
    defaultContent: <Text>默认内容</Text>,
    enableFallback: true
  });

  // 6. 函数式内容的响应式处理
  const dynamicContent = useLocalResponsive({
    md: () => (
      <div>
        <Text strong>动态内容示例</Text>
        <br />
        <Text type="secondary">
          当前时间: {new Date().toLocaleString()}
        </Text>
        <br />
        <Text type="warning">
          屏幕宽度: {window.innerWidth}px
        </Text>
      </div>
    ),
    lg: () => (
      <Card size="small" style={{ marginTop: 8 }}>
        <Title level={5}>实时信息面板</Title>
        <Paragraph>
          <Text strong>当前时间:</Text> {new Date().toLocaleString()}
        </Paragraph>
        <Paragraph>
          <Text strong>屏幕尺寸:</Text> {window.innerWidth} × {window.innerHeight}
        </Paragraph>
        <Paragraph>
          <Text strong>用户代理:</Text> {navigator.userAgent.substring(0, 50)}...
        </Paragraph>
      </Card>
    )
  }, {
    defaultContent: () => <Text>默认动态内容</Text>
  });

  return (
    <div className="local-responsive-example">
      <Card 
        title="局部响应式组件示例" 
        style={{ margin: spacing }}
      >
        {/* 响应式标题 */}
        <Title 
          level={2} 
          style={{ 
            fontSize: `${fontSize}px`,
            marginBottom: spacing 
          }}
        >
          {title}标题示例
        </Title>

        {/* 响应式按钮 */}
        <div style={{ marginBottom: spacing }}>
          <Text strong>响应式按钮尺寸: </Text>
          <Button size={buttonSize} type="primary">
            {buttonSize} 尺寸按钮
          </Button>
        </div>

        {/* 复杂响应式内容 */}
        <div style={{ marginBottom: spacing }}>
          <Title level={4}>复杂内容响应式:</Title>
          {complexContent as React.ReactNode}
        </div>

        {/* 动态响应式内容 */}
        <div style={{ marginBottom: spacing }}>
          <Title level={4}>动态内容响应式:</Title>
          {dynamicContent as React.ReactNode}
        </div>

        {/* 使用说明 */}
        <Card 
          type="inner" 
          title="使用说明" 
          size="small"
          style={{ marginTop: spacing }}
        >
          <Paragraph>
            <Text strong>useLocalResponsive</Text> 支持以下特性:
          </Paragraph>
          <ul>
            <li>文本、数字、React 节点的响应式处理</li>
            <li>函数式内容支持（支持动态计算）</li>
            <li>自动回退机制（向下查找更小断点）</li>
            <li>自定义默认内容</li>
            <li>TypeScript 类型安全</li>
          </ul>
          
          <Paragraph>
            <Text strong>专用 Hook:</Text>
          </Paragraph>
          <ul>
            <li><Text code>useLocalResponsiveText</Text> - 专门处理文本内容</li>
            <li><Text code>useLocalResponsiveValue</Text> - 专门处理数值内容</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
};

export default LocalResponsiveExample;