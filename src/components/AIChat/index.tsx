import { useState } from 'react';
import { Drawer, Button, Input, Space } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import './index.less';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: $tAuto('这是静态AI对话框，模型接入后可替换应答'), id: 'm0' },
  ]);

  const ai = new GoogleGenAI({ apiKey: '' });

  const ask = async (prompt: string) => {
    try {
      const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const maybeText = (res as unknown as { text?: unknown }).text;
      const maybeResponse = (res as unknown as { response?: { text?: () => string } }).response;
      const t =
        typeof maybeText === 'function'
          ? (maybeText as () => string)()
          : typeof maybeText === 'string'
          ? maybeText
          : typeof maybeResponse?.text === 'function'
          ? maybeResponse.text()
          : '';
      return t || $tAuto('生成失败');
    } catch (_err: unknown) {
      return $tAuto('请求失败，请检查配置');
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const uid = `u_${Date.now()}`;
    const aid = `a_${Date.now() + 1}`;
    const next = messages.concat(
      { role: 'user', content: text, id: uid },
      { role: 'assistant', content: $tAuto('正在生成应答…'), id: aid },
    );
    setMessages(next);
    setInput('');
    const reply = await ask(text);
    setMessages(m => m.map(it => (it.id === aid ? { ...it, content: reply } : it)));
  };

  const clear = () => {
    setMessages([{ role: 'assistant', content: $tAuto('已清空对话'), id: `c_${Date.now()}` }]);
  };

  return (
    <>
      <Button
        type='text'
        icon={<RobotOutlined />}
        onClick={() => setOpen(true)}
        className='ai-chat-trigger'
      >
        {$tAuto('AI 助手')}
      </Button>
      <Drawer
        title={$tAuto('AI 助手')}
        placement='right'
        // width={420}
        onClose={() => setOpen(false)}
        open={open}
        className='ai-chat-drawer'
      >
        <div className='ai-chat-body'>
          {messages.map(m => (
            <div key={m.id} className={`msg ${m.role}`}>
              <div className='bubble'>{m.content}</div>
            </div>
          ))}
        </div>
        <div className='ai-chat-input'>
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder={$tAuto('输入内容，Shift+Enter 换行')}
            onPressEnter={e => {
              if (!e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Space style={{ marginTop: 8 }}>
            <Button type='primary' onClick={send} disabled={!input.trim()}>
              {$tAuto('发送')}
            </Button>
            <Button onClick={clear}>{$tAuto('清空')}</Button>
          </Space>
        </div>
      </Drawer>
    </>
  );
};

export default AIChat;
