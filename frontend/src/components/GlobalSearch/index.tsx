import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Message, Typography, Space } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useSettingsStore } from '@/store/settings';
import styles from './index.module.less';

const GlobalSearch: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setGlobalLoading } = useAppStore();
  const { baseUrl, apiKey, model } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setVisible(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setUrl('');
    }
  }, [visible]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Message.warning('请输入抖音视频链接');
      return;
    }
    setVisible(false);
    setGlobalLoading(true, 'AI 正在深度解析视频「配方」...');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          url,
          llmConfig: { baseUrl, apiKey, model }
        })
      });
      const data = await res.json();
      if (data.success) {
        Message.success('解析成功');
        navigate(`/detail/${data.data.recipeCard.id}`);
      } else {
        Message.error(data.error || '解析失败');
      }
    } catch (error) {
      Message.error('网络请求失败');
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closable={false}
      className={styles.searchModal}
      autoFocus={false}
      focusLock={true}
      style={{ width: 600, marginTop: '-10vh' }}
    >
      <Input
        ref={inputRef}
        className={styles.searchInput}
        prefix={<IconSearch style={{ fontSize: 20, color: 'var(--color-text-3)', marginRight: 8 }} />}
        placeholder="粘贴抖音视频链接以立即分析..."
        value={url}
        onChange={setUrl}
        onPressEnter={handleAnalyze}
        allowClear
      />
      <div className={styles.hints}>
        <Space size="large">
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <kbd style={kbdStyle}>Enter</kbd> 分析
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <kbd style={kbdStyle}>Esc</kbd> 关闭
          </Typography.Text>
        </Space>
      </div>
    </Modal>
  );
};

const kbdStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-fill-2)',
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  padding: '2px 6px',
  fontFamily: 'monospace',
  fontSize: 12,
  marginRight: 4
};

export default GlobalSearch;