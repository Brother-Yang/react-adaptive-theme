import React, { useState } from 'react'
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
  Col
} from 'antd'
import { 
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons'
import Sidebar from './components/Sidebar'
import AppHeader from './components/Header'
import './App.less'

const { Content } = Layout
const { Option } = Select

function App() {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const tableData = [
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区', status: 'active' },
    { key: '2', name: '李四', age: 28, address: '上海市浦东新区', status: 'inactive' },
    { key: '3', name: '王五', age: 35, address: '广州市天河区', status: 'active' }
  ]

  const tableColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </>
      ),
    }
  ]

  const timelineItems = [
    {
      children: '创建项目 2024-01-15',
    },
    {
      children: '完成需求分析 2024-01-16',
    },
    {
      children: '开始开发 2024-01-17',
    },
    {
      children: '测试阶段 2024-01-20',
    },
  ]

  return (
    <Layout className="app">
      <Sidebar collapsed={collapsed} />
      <Layout className={`main-layout ${collapsed ? 'collapsed' : ''}`}>
        <AppHeader collapsed={collapsed} onToggle={toggleCollapsed} />
        <Content className="app-content">
          <div className="demo-container">
            {/* 基础组件 */}
            <Card title="基础组件" className="demo-card">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Input
                    placeholder="请输入内容"
                    prefix={<SearchOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Select defaultValue="option1" style={{ width: '100%' }}>
                    <Option value="option1">选项一</Option>
                    <Option value="option2">选项二</Option>
                    <Option value="option3">选项三</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <DatePicker style={{ width: '100%' }} placeholder="选择日期" />
                </Col>
              </Row>
            </Card>

            {/* 输入组件 */}
            <Card title="输入组件" className="demo-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <p>滑块控件:</p>
                    <Slider defaultValue={30} />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <p>开关和选择:</p>
                    <Switch defaultChecked style={{ marginRight: 16 }} />
                    <Radio.Group defaultValue="a">
                      <Radio.Button value="a">选项A</Radio.Button>
                      <Radio.Button value="b">选项B</Radio.Button>
                      <Radio.Button value="c">选项C</Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Checkbox.Group
                    options={['苹果', '香蕉', '橙子', '葡萄']}
                    defaultValue={['苹果', '橙子']}
                  />
                </Col>
              </Row>
            </Card>

            {/* 展示组件 */}
            <Card title="展示组件" className="demo-card">
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              
              <Divider>标签和徽章</Divider>
              
              <div style={{ marginBottom: 16 }}>
                <Tag>默认标签</Tag>
                <Tag color="blue">蓝色标签</Tag>
                <Tag color="green">绿色标签</Tag>
                <Tag color="red">红色标签</Tag>
                <Badge count={5}>
                  <Avatar shape="square" size="large" />
                </Badge>
              </div>
              
              <Alert
                message="成功提示"
                description="这是一个成功提示的详细描述信息。"
                type="success"
                showIcon
              />
              <Alert
                message="警告提示"
                description="这是一个警告提示的详细描述信息。"
                type="warning"
                showIcon
              />
              <Alert
                message="错误提示"
                description="这是一个错误提示的详细描述信息。"
                type="error"
                showIcon
              />
            </Card>

            {/* 流程组件 */}
            <Card title="流程组件" className="demo-card">
              <Steps
                current={1}
                items={[
                  {
                    title: '已完成',
                    description: '这是第一步的描述',
                  },
                  {
                    title: '进行中',
                    description: '这是第二步的描述',
                  },
                  {
                    title: '等待中',
                    description: '这是第三步的描述',
                  },
                ]}
              />
              
              <Divider>时间轴</Divider>
              
              <Timeline items={timelineItems} />
            </Card>

            {/* 数据展示 */}
            <Card title="数据展示" className="demo-card">
              <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增
                </Button>
                <Button icon={<DownloadOutlined />} style={{ marginLeft: 8 }}>
                  导出
                </Button>
                <Button icon={<UploadOutlined />} style={{ marginLeft: 8 }}>
                  导入
                </Button>
              </div>
              <Table dataSource={tableData} columns={tableColumns} />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
