import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Message, Avatar } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import Typography from '@/components/Typography';

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
    } catch (error) {
      Message.error('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 300,
      render: (col: string, _record: Recipe) => (
        <Typography.Text bold>{col}</Typography.Text>
      )
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      width: 400,
      render: (col: string) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
          {col}
        </Typography.Paragraph>
      )
    },
    {
      title: '创作者',
      dataIndex: 'creator',
      width: 150,
      render: (col: any) => (
        <Space>
          <Avatar size={24}><img src={col?.avatarUrl || ''} alt={col?.nickname} /></Avatar>
          <Typography.Text>{col?.nickname}</Typography.Text>
        </Space>
      )
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 200,
      render: (col: string) => new Date(col).toLocaleString()
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_: any, record: Recipe) => (
        <Button type="text" onClick={() => navigate(`/detail/${record.id}`)}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 0', maxWidth: 1200, margin: '0 auto' }}>
      <Typography.Title heading={2} style={{ marginTop: 0 }}>历史记录</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        查看所有「历史配方卡」。
      </Typography.Paragraph>
      
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
    </div>
  );
};

export default History;
