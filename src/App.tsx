import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Layout,
  Input,
  Select,
  DatePicker,
  Slider,
  Switch,
  Radio,
  Checkbox,
  Progress,
  Tag,
  Alert,
  Divider,
  Table,
  Badge,
  Avatar,
  Timeline,
  Steps,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import Sidebar from './components/Sidebar';
import AppHeader from './components/Header';
import BreakpointIndicator from './components/BreakpointIndicator';
import TestTranslation from './components/TestTranslation';
import LocalResponsiveExample from './components/LocalResponsiveExample';
import { useBreakpoint } from './hooks/useBreakpoint';
import './App.less';

const { Content } = Layout;
const { Option } = Select;

// 生成表格数据的函数
const createTableData = () =>
  [
    { key: '1', name: 'John Doe', age: 32, address: 'New York', status: 'active' },
    { key: '2', name: 'Jane Smith', age: 28, address: 'London', status: 'inactive' },
    { key: '3', name: 'Bob Johnson', age: 35, address: 'Tokyo', status: 'active' },
  ] as const;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const breakpoint = useBreakpoint();

  // 根据当前语言生成数据
  const tableData = createTableData();
  const timelineItems = [
    {
      children: `${window.$tAuto('演示页面')} 2024-01-15`,
    },
    {
      children: `${window.$tAuto('确认')} 2024-01-16`,
    },
    {
      children: `${window.$tAuto('编辑')} 2024-01-17`,
    },
    {
      children: `${window.$tAuto('提交')} 2024-01-20`,
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 移动端自动收起侧边栏
  useEffect(() => {
    if (breakpoint.isMobile) {
      setCollapsed(true);
    }
  }, [breakpoint.isMobile]);

  // 使用useMemo优化表格列配置
  const tableColumns = [
    { title: window.$tAuto('请输入'), dataIndex: 'name', key: 'name' },
    { title: window.$tAuto('状态'), dataIndex: 'age', key: 'age' },
    { title: window.$tAuto('创建时间'), dataIndex: 'address', key: 'address' },
    {
      title: window.$tAuto('状态'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? window.$tAuto('成功') : window.$tAuto('错误')}
        </Tag>
      ),
    },
    {
      title: window.$tAuto('操作'),
      key: 'action',
      render: () => (
        <>
          <Button type='link' icon={<EditOutlined />} size='small'>
            {window.$tAuto('编辑')}
          </Button>
          <Button type='link' danger icon={<DeleteOutlined />} size='small'>
            {window.$tAuto('删除')}
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout className='app'>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className={`main-layout ${collapsed ? 'collapsed' : ''} ${breakpoint.current}`}>
        <AppHeader collapsed={collapsed} onToggle={toggleCollapsed} />
        <Content className='app-content'>
          <TestTranslation />
          <LocalResponsiveExample />
          <div className='demo-container'>
            {/* 基础组件 */}
            <Card title={window.$tAuto('基础组件')} className='demo-card'>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Input placeholder={window.$tAuto('请输入')} prefix={<SearchOutlined />} />
                </Col>
                <Col span={8}>
                  <Select defaultValue='option1' style={{ width: '100%' }}>
                    <Option value='option1'>{window.$tAuto('请选择')} 1</Option>
                    <Option value='option2'>{window.$tAuto('请选择')} 2</Option>
                    <Option value='option3'>{window.$tAuto('请选择')} 3</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <DatePicker style={{ width: '100%' }} placeholder={window.$tAuto('请选择')} />
                </Col>
              </Row>
            </Card>

            {/* 输入组件 */}
            <Card title={window.$tAuto('输入组件')} className='demo-card'>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <p>{window.$tAuto('滑块控件')}:</p>
                    <Slider defaultValue={30} />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <p>{window.$tAuto('开关和选择')}:</p>
                    <Switch defaultChecked style={{ marginRight: 16 }} />
                    <Radio.Group defaultValue='a'>
                      <Radio.Button value='a'>{window.$tAuto('选项A')}</Radio.Button>
                      <Radio.Button value='b'>{window.$tAuto('选项B')}</Radio.Button>
                      <Radio.Button value='c'>{window.$tAuto('选项C')}</Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Checkbox.Group
                    options={[
                      window.$tAuto('苹果'),
                      window.$tAuto('香蕉'),
                      window.$tAuto('橙子'),
                      window.$tAuto('葡萄'),
                    ]}
                    defaultValue={[window.$tAuto('苹果'), window.$tAuto('橙子')]}
                  />
                </Col>
              </Row>
            </Card>

            {/* 展示组件 */}
            <Card title={window.$tAuto('展示组件')} className='demo-card'>
              <Progress percent={30} />
              <Progress percent={50} status='active' />
              <Progress percent={70} status='exception' />
              <Progress percent={100} />

              <Divider>{window.$tAuto('标签和徽章')}</Divider>

              <div style={{ marginBottom: 16 }}>
                <Tag>{window.$tAuto('确认')}</Tag>
                <Tag color='blue'>{window.$tAuto('信息')}</Tag>
                <Tag color='green'>{window.$tAuto('成功')}</Tag>
                <Tag color='red'>{window.$tAuto('错误')}</Tag>
                <Badge count={5}>
                  <Avatar shape='square' size='large' />
                </Badge>
              </div>

              <Alert
                message={window.$tAuto('成功')}
                description={window.$tAuto('这是一个成功提示的详细描述信息。')}
                type='success'
                showIcon
              />
              <Alert
                message={window.$tAuto('警告')}
                description={window.$tAuto('这是一个警告提示的详细描述信息。')}
                type='warning'
                showIcon
              />
              <Alert
                message={window.$tAuto('错误')}
                description={window.$tAuto('这是一个错误提示的详细描述信息。')}
                type='error'
                showIcon
              />
            </Card>

            {/* 流程组件 */}
            <Card title={window.$tAuto('流程组件')} className='demo-card'>
              <Steps
                current={1}
                items={[
                  {
                    title: window.$tAuto('成功'),
                    description: window.$tAuto('这是一个演示页面的详细描述'),
                  },
                  {
                    title: window.$tAuto('加载中...'),
                    description: window.$tAuto('这是一个演示页面的详细描述'),
                  },
                  {
                    title: window.$tAuto('等待中'),
                    description: window.$tAuto('这是一个演示页面的详细描述'),
                  },
                ]}
              />

              <Divider>{window.$tAuto('时间轴')}</Divider>

              <Timeline items={timelineItems} />
            </Card>

            {/* 数据展示 */}
            <Card title={window.$tAuto('演示页面')} className='demo-card'>
              <div style={{ marginBottom: 16 }}>
                <Button type='primary' icon={<PlusOutlined />}>
                  {window.$tAuto('添加')}
                </Button>
                <Button icon={<DownloadOutlined />} style={{ marginLeft: 8 }}>
                  {window.$tAuto('下载')}
                </Button>
                <Button icon={<UploadOutlined />} style={{ marginLeft: 8 }}>
                  {window.$tAuto('上传')}
                </Button>
              </div>
              <Table dataSource={tableData} columns={tableColumns} />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* 断点指示器 */}
      <BreakpointIndicator showDetails={false} clickable={true} />
    </Layout>
  );
}

export default App;
