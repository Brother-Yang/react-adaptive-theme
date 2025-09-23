import { Card, Typography, Timeline, Row, Col, Tag } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <InfoCircleOutlined
                style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }}
              />
              <Title level={1}>{$tAuto('关于我们')}</Title>
              <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                {$tAuto('了解更多关于这个项目的信息')}
              </Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={$tAuto('项目特性')}>
            <Timeline>
              <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                <Title level={4}>{$tAuto('响应式设计')}</Title>
                <Paragraph>{$tAuto('支持多种屏幕尺寸，自适应布局')}</Paragraph>
              </Timeline.Item>
              <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                <Title level={4}>{$tAuto('主题切换')}</Title>
                <Paragraph>{$tAuto('支持明暗主题切换，用户体验优秀')}</Paragraph>
              </Timeline.Item>
              <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                <Title level={4}>{$tAuto('国际化')}</Title>
                <Paragraph>{$tAuto('多语言支持，自动翻译功能')}</Paragraph>
              </Timeline.Item>
              <Timeline.Item dot={<RocketOutlined style={{ color: '#1890ff' }} />}>
                <Title level={4}>{$tAuto('现代技术栈')}</Title>
                <Paragraph>{$tAuto('基于React 19、Vite、TypeScript构建')}</Paragraph>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={$tAuto('技术栈')}>
            <div style={{ marginBottom: '16px' }}>
              <Title level={4}>{$tAuto('前端框架')}</Title>
              <div>
                <Tag color='blue'>React 19</Tag>
                <Tag color='green'>TypeScript</Tag>
                <Tag color='orange'>Vite</Tag>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Title level={4}>{$tAuto('UI组件库')}</Title>
              <div>
                <Tag color='blue'>Ant Design</Tag>
                <Tag color='purple'>Less</Tag>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Title level={4}>{$tAuto('国际化')}</Title>
              <div>
                <Tag color='cyan'>react-i18next</Tag>
                <Tag color='geekblue'>i18next</Tag>
              </div>
            </div>

            <div>
              <Title level={4}>{$tAuto('路由')}</Title>
              <div>
                <Tag color='magenta'>React Router</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;
