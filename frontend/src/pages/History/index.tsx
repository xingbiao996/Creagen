import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Message, Avatar, Card, Grid } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import Typography from '@/components/Typography';

const { Row, Col } = Grid;

interface Recipe {
  id: number;
  title: string;
  summary: string;
  creator: {
    nickname: string;
    avatarUrl: string;
  };
  createdAt: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?limit=${pageSize}&offset=${(current - 1) * pageSize}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data.items);
        setPagination(prev => ({ ...prev, current, pageSize, total: json.data.total }));
      } else {
        Message.error('获取历史记录失败');
      }
    } catch {
      Message.error('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  useEffect(() => {
    if (pagination.current > 1 || pagination.pageSize > 10) {
      fetchData(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: isMobile ? 150 : 300,
      render: (col: string, _record: Recipe) => (
        <Typography.Text bold>{col}</Typography.Text>
      )
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      width: isMobile ? 0 : 400,
      render: (col: string) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
          {col}
        </Typography.Paragraph>
      )
    },
    {
      title: '创作者',
      dataIndex: 'creator',
      width: isMobile ? 100 : 150,
      render: (col: any) => (
        <Space>
          <Avatar size={24}><img src={col?.avatarUrl || ''} alt={col?.nickname} /></Avatar>
          {!isMobile && <Typography.Text>{col?.nickname}</Typography.Text>}
        </Space>
      )
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: isMobile ? 100 : 200,
      render: (col: string) => isMobile 
        ? new Date(col).toLocaleDateString()
        : new Date(col).toLocaleString()
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 80,
      render: (_: any, record: Recipe) => (
        <Button type="text" size={isMobile ? 'small' : 'default'} onClick={() => navigate(`/detail/${record.id}`)}>
          {isMobile ? '查看' : '查看详情'}
        </Button>
      )
    }
  ];

  const mobileColumns = columns.filter(col => col.dataIndex !== 'summary');

  return (
    <div style={{ padding: 'var(--spacing-lg) 0', maxWidth: 1200, margin: '0 auto' }}>
      <Typography.Title heading={2} style={{ marginTop: 0 }}>历史记录</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        查看所有「历史配方卡」。
      </Typography.Paragraph>
      
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <Card loading />
          ) : (
            data.map(item => (
              <Card 
                key={item.id}
                hoverable
                onClick={() => navigate(`/detail/${item.id}`)}
                style={{ borderRadius: 6 }}
              >
                <Row gutter={12} align="center">
                  <Col flex="auto">
                    <Typography.Text bold style={{ fontSize: 14 }}>{item.title}</Typography.Text>
                    <div style={{ marginTop: 8 }}>
                      <Space size="small">
                        <Avatar size={20}>
                          <img src={item.creator?.avatarUrl || ''} alt={item.creator?.nickname} />
                        </Avatar>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          {item.creator?.nickname}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography.Text>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Table 
          rowKey="id"
          loading={loading}
          columns={columns} 
          data={data}
          scroll={{ x: 1000 }}
          pagination={{
            ...pagination,
            onChange: (current, pageSize) => fetchData(current, pageSize)
          }}
        />
      )}
      
      {isMobile && !loading && data.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space>
            <Button 
              disabled={pagination.current === 1}
              onClick={() => fetchData(pagination.current - 1, pagination.pageSize)}
            >
              上一页
            </Button>
            <Typography.Text type="secondary">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </Typography.Text>
            <Button 
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => fetchData(pagination.current + 1, pagination.pageSize)}
            >
              下一页
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default History;
