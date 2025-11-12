import React from 'react';
import { GridLayout } from '@/components/GridLayout';
import type { GridLayoutItem } from '@/components/GridLayout';
import { Button, Tag, Space } from 'antd';
import './index.less';

const LayoutDemo: React.FC = () => {
  const { Label, Value } = GridLayout;

  // 基础示例数据
  const basicItems: GridLayoutItem[] = [
    {
      label: (
        <Label width={80} required>
          姓名
        </Label>
      ),
      value: <Value>张三</Value>,
    },
    {
      label: <Label width={80}>年龄</Label>,
      value: <Value>28岁</Value>,
    },
    {
      label: <Label width={80}>职位</Label>,
      value: <Value>前端工程师</Value>,
    },
    {
      label: <Label width={80}>部门</Label>,
      value: <Value>技术部</Value>,
    },
  ];

  // 跨列示例数据
  const spanItems: GridLayoutItem[] = [
    {
      label: <Label width={100}>项目名称</Label>,
      value: <Value span={2}>React 自适应主题系统</Value>,
    },
    {
      label: <Label width={80}>状态</Label>,
      value: (
        <Value>
          <Tag color='green'>进行中</Tag>
        </Value>
      ),
    },
    {
      label: <Label width={100}>项目描述</Label>,
      value: (
        <Value span={3}>
          这是一个基于 React + TypeScript + Vite 的自适应主题系统，支持多种断点响应式设计。
        </Value>
      ),
    },
  ];

  // 复杂内容示例
  const complexItems: GridLayoutItem[] = [
    {
      label: <Label width={60}>操作</Label>,
      value: (
        <Value>
          <Space>
            <Button type='primary' size='small'>
              编辑
            </Button>
            <Button size='small'>查看</Button>
            <Button danger size='small'>
              删除
            </Button>
          </Space>
        </Value>
      ),
    },
    {
      label: <Label width={60}>标签</Label>,
      value: (
        <Value span={2}>
          <Space wrap>
            <Tag color='blue'>React</Tag>
            <Tag color='green'>TypeScript</Tag>
            <Tag color='orange'>Vite</Tag>
          </Space>
        </Value>
      ),
    },
  ];

  return (
    <div className='layout-demo'>
      <div className='layout-demo__section'>
        <h2>基础布局</h2>
        <p>默认三列水平布局</p>
        <GridLayout items={basicItems} />
      </div>

      <div className='layout-demo__section'>
        <h2>不同列数</h2>
        <p>两列布局示例</p>
        <GridLayout items={basicItems} columns={2} />
      </div>

      <div className='layout-demo__section'>
        <h2>垂直布局</h2>
        <p>垂直方向排列</p>
        <GridLayout items={basicItems} columns={2} direction='vertical' />
      </div>

      <div className='layout-demo__section'>
        <h2>跨列布局</h2>
        <p>Value组件支持跨多列显示</p>
        <GridLayout items={spanItems} columns={3} />
      </div>

      <div className='layout-demo__section'>
        <h2>复杂内容</h2>
        <p>支持按钮、标签等复杂组件</p>
        <GridLayout items={complexItems} columns={3} gap={24} />
      </div>

      <div className='layout-demo__section'>
        <h2>对齐方式</h2>
        <p>控制Label和Value的垂直对齐</p>
        <GridLayout
          items={[
            {
              label: (
                <Label width={80}>
                  上对齐
                  <br />
                  标签
                </Label>
              ),
              value: (
                <Value>
                  这是一个很长的内容，会换行显示，用来测试上对齐的效果。当Label和Value的高度不一致时，可以看到Label会与Value的顶部对齐。
                </Value>
              ),
              alignItems: 'flex-start',
            },
            {
              label: (
                <Label width={80}>
                  居中
                  <br />
                  对齐
                  <br />
                  标签
                </Label>
              ),
              value: <Value>居中对齐示例内容</Value>,
              alignItems: 'center',
            },
            {
              label: (
                <Label width={80}>
                  下对齐
                  <br />
                  标签
                </Label>
              ),
              value: (
                <Value>
                  这也是一个很长的内容，会换行显示，用来测试下对齐的效果。可以看到Label会与Value的底部对齐，形成明显的对比效果。
                </Value>
              ),
              alignItems: 'flex-end',
            },
          ]}
          columns={1}
          gap={20}
        />
      </div>

      <div className='layout-demo__section'>
        <h2>统一宽度设置</h2>
        <p>通过 labelWidth 和 valueWidth 属性统一设置宽度</p>

        <h3>统一Label宽度</h3>
        <GridLayout
          items={[
            { label: <Label>姓名</Label>, value: <Value>张三</Value> },
            { label: <Label>职位</Label>, value: <Value>前端工程师</Value> },
            { label: <Label>部门</Label>, value: <Value>技术部</Value> },
          ]}
          columns={2}
          labelWidth={100}
          gap={16}
        />

        <h3>同时设置Label和Value宽度</h3>
        <GridLayout
          items={[
            { label: <Label>用户名</Label>, value: <Value>admin</Value> },
            { label: <Label>邮箱</Label>, value: <Value>admin@example.com</Value> },
            { label: <Label>角色</Label>, value: <Value>管理员</Value> },
          ]}
          columns={2}
          labelWidth={80}
          valueWidth={200}
          gap={16}
        />

        <h3>个别覆盖统一设置</h3>
        <GridLayout
          items={[
            { label: <Label>标题</Label>, value: <Value>使用统一宽度</Value> },
            {
              label: <Label width={120}>特殊标题</Label>,
              value: <Value width={250}>覆盖统一宽度</Value>,
            },
            { label: <Label>描述</Label>, value: <Value>又回到统一宽度</Value> },
          ]}
          columns={1}
          labelWidth={80}
          valueWidth={180}
          gap={16}
        />
      </div>
    </div>
  );
};

export default LayoutDemo;
