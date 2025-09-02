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
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import AppHeader from './components/Header'
import BreakpointIndicator from './components/BreakpointIndicator'
import TestTranslation from './components/TestTranslation'
import { useBreakpoint } from './hooks/useBreakpoint'
import './App.less'

const { Content } = Layout
const { Option } = Select

// 生成表格数据的函数
const createTableData = () => [
  { key: '1', name: 'John Doe', age: 32, address: 'New York', status: 'active' },
  { key: '2', name: 'Jane Smith', age: 28, address: 'London', status: 'inactive' },
  { key: '3', name: 'Bob Johnson', age: 35, address: 'Tokyo', status: 'active' }
] as const

// 生成时间轴数据的函数
const createTimelineItems = (t: (key: string) => string) => [
  {
    children: `${t('demo.title')} 2024-01-15`,
  },
  {
    children: `${t('common.confirm')} 2024-01-16`,
  },
  {
    children: `${t('common.edit')} 2024-01-17`,
  },
  {
    children: `${t('common.submit')} 2024-01-20`,
  },
]

function App() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const breakpoint = useBreakpoint()
  
  // 根据当前语言生成数据
  const tableData = createTableData()
  const timelineItems = createTimelineItems(t)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // 移动端自动收起侧边栏
  React.useEffect(() => {
    if (breakpoint.isMobile) {
      setCollapsed(true)
    }
  }, [breakpoint.isMobile])

  // 使用useMemo优化表格列配置
  const tableColumns = React.useMemo(() => [
    { title: t('form.pleaseInput'), dataIndex: 'name', key: 'name' },
    { title: t('table.status'), dataIndex: 'age', key: 'age' },
    { title: t('table.createTime'), dataIndex: 'address', key: 'address' },
    {
      title: t('table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t('common.success') : t('common.error')}
        </Tag>
      ),
    },
    {
      title: t('table.actions'),
      key: 'action',
      render: () => (
        <>
          <Button type="link" icon={<EditOutlined />} size="small">
            {t('common.edit')}
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            {t('common.delete')}
          </Button>
        </>
      ),
    }
  ], [t])

  return (
    <Layout className="app">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className={`main-layout ${collapsed ? 'collapsed' : ''} ${breakpoint.current}`}>
        <AppHeader collapsed={collapsed} onToggle={toggleCollapsed} />
        <Content className="app-content">
          <TestTranslation />
          <div className="demo-container">
            {/* 基础组件 */}
            <Card title={t('demo.features.responsive')} className="demo-card">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Input
                    placeholder={t('form.pleaseInput')}
                    prefix={<SearchOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Select defaultValue="option1" style={{ width: '100%' }}>
                    <Option value="option1">{t('form.pleaseSelect')} 1</Option>
                    <Option value="option2">{t('form.pleaseSelect')} 2</Option>
                    <Option value="option3">{t('form.pleaseSelect')} 3</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <DatePicker style={{ width: '100%' }} placeholder={t('form.pleaseSelect')} />
                </Col>
              </Row>
            </Card>

            {/* 输入组件 */}
        <Card title={t('demo.inputComponents')} className="demo-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <p>{t('demo.slider')}:</p>
                    <Slider defaultValue={30} />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <p>{t('demo.switchAndSelect')}:</p>
                    <Switch defaultChecked style={{ marginRight: 16 }} />
                    <Radio.Group defaultValue="a">
                      <Radio.Button value="a">{t('demo.optionA')}</Radio.Button>
            <Radio.Button value="b">{t('demo.optionB')}</Radio.Button>
            <Radio.Button value="c">{t('demo.optionC')}</Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Checkbox.Group
                    options={[t('demo.apple'), t('demo.banana'), t('demo.orange'), t('demo.grape')]}
            defaultValue={[t('demo.apple'), t('demo.orange')]}
                  />
                </Col>
              </Row>
            </Card>

            {/* 展示组件 */}
            <Card title={t('demo.features.theme')} className="demo-card">
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              
              <Divider>{t('demo.tagsAndBadges')}</Divider>
              
              <div style={{ marginBottom: 16 }}>
                <Tag>{t('common.confirm')}</Tag>
                <Tag color="blue">{t('common.info')}</Tag>
                <Tag color="green">{t('common.success')}</Tag>
                <Tag color="red">{t('common.error')}</Tag>
                <Badge count={5}>
                  <Avatar shape="square" size="large" />
                </Badge>
              </div>
              
              <Alert
                message={t('common.success')}
                description={t('demo.successDescription')}
                type="success"
                showIcon
              />
              <Alert
                message={t('common.warning')}
                description={t('demo.warningDescription')}
                type="warning"
                showIcon
              />
              <Alert
                message={t('common.error')}
                description={t('demo.errorDescription')}
                type="error"
                showIcon
              />
            </Card>

            {/* 流程组件 */}
        <Card title={t('demo.processComponents')} className="demo-card">
              <Steps
                current={1}
                items={[
                  {
                    title: t('common.success'),
                    description: t('demo.description'),
                  },
                  {
                    title: t('common.loading'),
                    description: t('demo.description'),
                  },
                  {
                    title: t('common.pending'),
                    description: t('demo.description'),
                  },
                ]}
              />
              
              <Divider>{t('demo.timeline')}</Divider>
              
              <Timeline items={timelineItems} />
            </Card>

            {/* 数据展示 */}
            <Card title={t('demo.title')} className="demo-card">
              <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  {t('common.add')}
                </Button>
                <Button icon={<DownloadOutlined />} style={{ marginLeft: 8 }}>
                  {t('common.download')}
                </Button>
                <Button icon={<UploadOutlined />} style={{ marginLeft: 8 }}>
                  {t('common.upload')}
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
  )
}

export default App
