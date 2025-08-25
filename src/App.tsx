import { useState } from 'react'
import { Button, Card, Typography, Space, Layout, theme } from 'antd'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.less'

const { Header, Content } = Layout
const { Title, Paragraph } = Typography

function App() {
  const [count, setCount] = useState(0)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          React + Vite + TypeScript + Less + Ant Design
        </Title>
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
        
        <Card 
          title="计数器示例" 
          className="demo-card"
          style={{ background: colorBgContainer }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => setCount((count) => count + 1)}
            >
              点击次数: {count}
            </Button>
            <Paragraph>
              编辑 <code>src/App.tsx</code> 并保存以测试热更新
            </Paragraph>
          </Space>
        </Card>
        
        <Paragraph className="footer-text">
          点击 Vite 和 React 图标了解更多信息
        </Paragraph>
      </Content>
    </Layout>
  )
}

export default App
