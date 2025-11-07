import { Card, Typography, Row, Col, Button } from 'antd';
import { HomeOutlined, RocketOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import LazyImage from '@/components/LazyImage';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <HomeOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={1}>{$tAuto('欢迎来到首页')}</Title>
              <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                {$tAuto('这是一个响应式主题演示应用')}
              </Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <RocketOutlined
                style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}
              />
              <Title level={3}>{$tAuto('快速开始')}</Title>
              <Paragraph>{$tAuto('探索我们的功能和特性')}</Paragraph>
              <Button type='primary'>{$tAuto('了解更多')}</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <StarOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
              <Title level={3}>{$tAuto('特色功能')}</Title>
              <Paragraph>{$tAuto('响应式设计和主题切换')}</Paragraph>
              <Button>{$tAuto('查看详情')}</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <HomeOutlined style={{ fontSize: '48px', color: '#eb2f96', marginBottom: '16px' }} />
              <Title level={3}>{$tAuto('国际化支持')}</Title>
              <Paragraph>{$tAuto('多语言支持，自动翻译')}</Paragraph>
              <Button>{$tAuto('切换语言')}</Button>
            </div>
          </Card>
        </Col>

        {/* LazyImage 演示 */}
        <Col span={24}>
          <Card title={$tAuto('图片懒加载演示')}>
            <Row gutter={[16, 16]}>
              {[1015, 1025, 1035, 1045, 1055, 1065, 1075].map(id => (
                <Col xs={24} md={12} lg={8} key={id}>
                  <LazyImage
                    src={`https://picsum.photos/id/${id}/800/450`}
                    aspectRatio='16/9'
                    rounded
                    style={{ width: '100%' }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
              <Title level={3}>{$tAuto('嵌套路由示例')}</Title>
              <Paragraph>{$tAuto('体验多层嵌套路由功能')}</Paragraph>
              <div style={{ marginTop: '16px' }}>
                <Link to='profile'>
                  <Button type='primary'>{$tAuto('个人资料')}</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Outlet />
    </div>
  );
};

export default Home;
