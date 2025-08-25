import { useState } from 'react'
import { 
  Button, 
  Card, 
  Typography, 
  Space, 
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
  Steps
} from 'antd'
import { 
  UserOutlined, 
  SettingOutlined, 
  HeartOutlined, 
  StarOutlined
} from '@ant-design/icons'
import ThemeToggle from './components/ThemeToggle'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.less'

const { Header, Content } = Layout
const { Title, Paragraph } = Typography

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('option1')
  const [sliderValue, setSliderValue] = useState(30)
  const [switchValue, setSwitchValue] = useState(false)
  const [radioValue, setRadioValue] = useState('a')
  const [checkedValue, setCheckedValue] = useState(false)

  const tableData = [
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
    { key: '2', name: '李四', age: 28, address: '上海市浦东新区' },
    { key: '3', name: '王五', age: 35, address: '广州市天河区' }
  ]

  const tableColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' }
  ]


  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          React + Vite + TypeScript + Less + Ant Design
        </Title>
        <ThemeToggle showLabel size="default" />
      </Header>
      <Content className="app-content">
        <div className="logo-container">
          <Space size="large">
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </Space>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 基础组件展示 */}
          <Card title="基础组件" className="demo-card">
            <Space wrap size="middle">
              <Button type="primary" icon={<UserOutlined />}>
                主要按钮
              </Button>
              <Button type="default">
                默认按钮
              </Button>
              <Button type="dashed">
                虚线按钮
              </Button>
              <Button type="text">
                文本按钮
              </Button>
              <Button type="link">
                链接按钮
              </Button>
              <Button 
                type="primary" 
                size="large"
                onClick={() => setCount((count) => count + 1)}
              >
                计数器: {count}
              </Button>
            </Space>
          </Card>

          {/* 输入组件展示 */}
          <Card title="输入组件" className="demo-card">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space wrap size="middle">
                <Input 
                  placeholder="请输入内容" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  prefix={<UserOutlined />}
                />
                <Select 
                  value={selectValue} 
                  onChange={setSelectValue}
                  style={{ width: 120 }}
                >
                  <Select.Option value="option1">选项1</Select.Option>
                  <Select.Option value="option2">选项2</Select.Option>
                  <Select.Option value="option3">选项3</Select.Option>
                </Select>
                <DatePicker placeholder="选择日期" />
              </Space>
              
              <div>
                <Typography.Text>滑块值: {sliderValue}</Typography.Text>
                <Slider 
                  value={sliderValue} 
                  onChange={setSliderValue}
                  style={{ width: 200 }}
                />
              </div>

              <Space size="middle">
                <Switch 
                  checked={switchValue} 
                  onChange={setSwitchValue}
                  checkedChildren="开"
                  unCheckedChildren="关"
                />
                <Radio.Group value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                  <Radio value="a">选项A</Radio>
                  <Radio value="b">选项B</Radio>
                  <Radio value="c">选项C</Radio>
                </Radio.Group>
                <Checkbox 
                  checked={checkedValue} 
                  onChange={(e) => setCheckedValue(e.target.checked)}
                >
                  复选框
                </Checkbox>
              </Space>
            </Space>
          </Card>

          {/* 展示组件 */}
          <Card title="展示组件" className="demo-card">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space wrap size="middle">
                <Tag color="blue">蓝色标签</Tag>
                <Tag color="green">绿色标签</Tag>
                <Tag color="orange">橙色标签</Tag>
                <Tag color="red">红色标签</Tag>
                <Badge count={5}>
                  <Avatar shape="square" icon={<UserOutlined />} />
                </Badge>
                <Badge dot>
                  <Avatar shape="square" icon={<SettingOutlined />} />
                </Badge>
              </Space>

              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />

              <Alert message="信息提示" type="info" showIcon />
              <Alert message="成功提示" type="success" showIcon />
              <Alert message="警告提示" type="warning" showIcon />
              <Alert message="错误提示" type="error" showIcon />
            </Space>
          </Card>

          {/* 时间轴和步骤条 */}
          <Card title="流程组件" className="demo-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Steps
                current={1}
                items={[
                  { title: '已完成', description: '这是描述' },
                  { title: '进行中', description: '这是描述' },
                  { title: '待处理', description: '这是描述' }
                ]}
              />
              
              <Timeline
                items={[
                  { children: '创建服务现场 2015-09-01' },
                  { children: '初步排除网络异常 2015-09-01' },
                  { children: '技术测试异常 2015-09-01' },
                  { children: '网络异常正在修复 2015-09-01' }
                ]}
              />
            </Space>
          </Card>

          {/* 数据表格 */}
          <Card title="数据表格" className="demo-card">
            <Table 
              dataSource={tableData} 
              columns={tableColumns} 
              pagination={false}
              size="middle"
            />
          </Card>

          <Divider>
            <Space>
              <HeartOutlined style={{ color: '#ff4d4f' }} />
              <Typography.Text type="secondary">
                主题切换展示完成
              </Typography.Text>
              <StarOutlined style={{ color: '#faad14' }} />
            </Space>
          </Divider>
        </Space>
        
        <Paragraph className="footer-text">
          点击 Vite 和 React 图标了解更多信息
        </Paragraph>
      </Content>
    </Layout>
  )
}

export default App
