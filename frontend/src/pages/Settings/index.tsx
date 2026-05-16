import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Message, Typography, AutoComplete, Grid } from '@arco-design/web-react';
import { IconThunderbolt, IconRobot, IconSettings } from '@arco-design/web-react/icon';
import { useSettingsStore } from '@/store/settings';
import styles from './index.module.less';

const { Row, Col } = Grid;

const presetModels = [
  'doubao-seed-2-0-lite-260428',
  'doubao-seed-2-0-pro-260215',
  'gpt-4o-mini',
  'gpt-4o'
];

type ProviderType = 'volcengine' | 'openai' | 'custom';

const PROVIDERS = [
  {
    id: 'volcengine',
    title: '火山方舟 (豆包)',
    icon: <IconThunderbolt />,
    desc: '推荐。支持全模态感知与深度思考。',
    defaultUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-seed-2-0-lite-260428'
  },
  {
    id: 'openai',
    title: 'OpenAI',
    icon: <IconRobot />,
    desc: '官方接口，支持 GPT-4o 等系列模型。',
    defaultUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini'
  },
  {
    id: 'custom',
    title: '自定义 / 代理',
    icon: <IconSettings />,
    desc: '自定义 Base URL，适用于代理节点或本地模型。',
    defaultUrl: '',
    defaultModel: ''
  }
];

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const { baseUrl, apiKey, model, loading, fetchSettings, saveSettings } = useSettingsStore();
  
  const [provider, setProvider] = useState<ProviderType>('custom');

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    form.setFieldsValue({ baseUrl, apiKey, model });
    
    // Auto-detect provider based on URL
    if (baseUrl === 'https://ark.cn-beijing.volces.com/api/v3') {
      setProvider('volcengine');
    } else if (baseUrl === 'https://api.openai.com/v1') {
      setProvider('openai');
    } else {
      setProvider('custom');
    }
  }, [baseUrl, apiKey, model, form]);

  const handleProviderSelect = (selectedId: ProviderType) => {
    setProvider(selectedId);
    const selectedProvider = PROVIDERS.find(p => p.id === selectedId);
    if (selectedProvider) {
      form.setFieldsValue({
        baseUrl: selectedProvider.defaultUrl,
        model: selectedProvider.defaultModel || form.getFieldValue('model')
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await saveSettings(values);
      Message.success('设置已保存');
    } catch (error) {
      Message.error('保存失败');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <Typography.Title heading={3} style={{ marginBottom: 24 }}>AI 引擎配置</Typography.Title>
      
      <Typography.Text type="secondary" style={{ marginBottom: 12, display: 'block' }}>选择模型提供商</Typography.Text>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {PROVIDERS.map(p => (
          <Col span={8} key={p.id}>
            <Card 
              className={`${styles.providerCard} ${provider === p.id ? styles.providerCardActive : ''}`}
              onClick={() => handleProviderSelect(p.id as ProviderType)}
              bordered
            >
              <div className={styles.providerIcon}>{p.icon}</div>
              <Typography.Title heading={6} style={{ marginTop: 0, marginBottom: 8 }}>
                {p.title}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {p.desc}
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleSubmit}
        >
          <Form.Item
            label="API Base URL"
            field="baseUrl"
            rules={[{ required: true, message: '请输入 API Base URL' }]}
            hidden={provider !== 'custom'}
          >
            <Input placeholder="输入 API Base URL" />
          </Form.Item>

          <Form.Item
            label="API Key"
            field="apiKey"
            rules={[{ required: true, message: '请输入 API Key' }]}
            extra={provider === 'volcengine' ? '请在火山引擎控制台获取 API Key' : ''}
          >
            <Input.Password placeholder="输入 API Key" />
          </Form.Item>

          <Form.Item
            label="Model (接入点)"
            field="model"
            rules={[{ required: true, message: '请输入模型名称' }]}
            extra={provider === 'volcengine' ? '注意：火山方舟需填入 Endpoint ID (ep-xxx) 或预置的模型名称' : ''}
          >
            <AutoComplete 
              placeholder="输入或选择模型名称" 
              data={presetModels}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ width: 120 }}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
