import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { useAutoTranslation } from '../../hooks/useAutoTranslation';
// 测试性能优化效果

const { Title, Paragraph } = Typography;

const TestTranslation: React.FC = () => {
  const { tAuto, locale } = useAutoTranslation();

  return (
    <Card title={tAuto('测试翻译功能')} style={{ margin: '20px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div>
          <Title level={4}>
            {tAuto('当前语言')}: {locale}
          </Title>
        </div>

        <div>
          <Title level={5}>{tAuto('自动生成key的示例')}:</Title>
          <Paragraph>{tAuto('自动翻译测试')}</Paragraph>
          <Paragraph>{tAuto('这是一个测试文本，会自动生成key')}</Paragraph>
          <Paragraph>{tAuto('欢迎使用自动国际化系统')}</Paragraph>
          <Paragraph>{tAuto('系统会自动为每个文本生成唯一的key')}</Paragraph>
        </div>

        <div>
          <Title level={5}>{tAuto('手动指定key的示例')}:</Title>
          <Paragraph>{tAuto('这是手动指定key的文本', { key: 'test.manual.key' })}</Paragraph>
        </div>

        <div>
          <Title level={5}>{tAuto('使用tWithKey的示例')}:</Title>
          <Paragraph>{tAuto('确认')}</Paragraph>
          <Paragraph>{tAuto('取消')}</Paragraph>
        </div>

        <div>
          <Space>
            <Button type='primary'>{tAuto('保存')}</Button>
            <Button>{tAuto('取消')}</Button>
            <Button type='dashed'>{tAuto('重置')}</Button>
          </Space>
        </div>

        <div>
          <Title level={5}>{tAuto('插值变量示例')}:</Title>
          <Paragraph>
            {tAuto('欢迎 {{name}}，今天是 {{date}}', { name: '张三', date: '2024年1月15日' })}
          </Paragraph>
          <Paragraph>{tAuto('您有 {{count}} 条未读消息', { count: 5 })}</Paragraph>
          <Paragraph>
            {tAuto('手动key的插值示例：用户 {{username}} 登录成功', {
              key: 'user.login.success',
              username: '李四',
            })}
          </Paragraph>
        </div>

        <div>
          <Title level={5}>{tAuto('英文示例')}:</Title>
          <Paragraph>{tAuto('Hello World')}</Paragraph>
          <Paragraph>{tAuto('This is an English text example')}</Paragraph>
          <Paragraph>{tAuto('this is an English text example')}</Paragraph>
          <Paragraph>{tAuto('This is an example of English characters being too long')}</Paragraph>
          <Paragraph>
            {tAuto('Hello {{name}}, you have {{count}} new messages', { name: 'John', count: 3 })}
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default TestTranslation;
