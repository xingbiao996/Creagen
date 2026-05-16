import React, { useState, useEffect } from 'react';
import { Input, Card, Grid, Space, Avatar, Message, Skeleton } from '@arco-design/web-react';
import { IconFire, IconStar, IconPlayArrow, IconThunderbolt } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import Typography from '@/components/Typography';
import { useAppStore } from '@/store';
import { useSettingsStore } from '@/store/settings';
import styles from './index.module.less';

const { Row, Col } = Grid;

interface Creator {
  id: number;
  nickname: string;
  avatarUrl: string;
  description: string;
}

interface Recipe {
  id: number;
  title: string;
  summary: string;
  creator: Creator;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const { setGlobalLoading } = useAppStore();
  const { baseUrl, apiKey, model } = useSettingsStore();
  
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/recommendations');
        const data = await res.json();
        if (data.success) {
          setCreators(data.data.featuredCreators);
          setRecipes(data.data.trendingRecipes);
        }
      } catch (error) {
        Message.error('获取推荐数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Message.warning('请输入抖音视频链接');
      return;
    }
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
    <div className={styles.homeContainer}>
      
      {/* 顶部吸顶输入栏 */}
      <div className={styles.stickyInputBar}>
        <IconThunderbolt style={{ fontSize: 24, color: 'var(--arcoblue-6)' }} />
        <Input.Search
          size="large"
          placeholder="粘贴抖音视频链接，一键生成创作配方卡..."
          searchButton="立即分析"
          value={url}
          onChange={setUrl}
          onSearch={handleAnalyze}
          onPressEnter={handleAnalyze}
          style={{ flex: 1 }}
        />
      </div>

      <Row gutter={24}>
        {/* 左侧：主信息流 (17/24) */}
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <div className={styles.mainFeed}>
            <div className={styles.sectionHeader}>
              <IconStar style={{ fontSize: 24, color: '#ffb400', marginRight: 8 }} />
              <Typography.Title heading={3} style={{ margin: 0 }}>最新「创作配方」</Typography.Title>
            </div>
            
            <Skeleton loading={loading} text={{ rows: 6 }} animation>
              <Row gutter={[24, 24]}>
                {recipes.length > 0 ? recipes.map(recipe => (
                  <Col xs={24} sm={12} md={12} lg={8} xl={8} key={recipe.id}>
                    <Card 
                      hoverable 
                      className={styles.recipeCard}
                      cover={
                        <div className={styles.recipeCover}>
                          <IconPlayArrow style={{ fontSize: 48, color: '#fff' }} />
                        </div>
                      }
                      onClick={() => navigate(`/detail/${recipe.id}`)}
                    >
                      <Card.Meta
                        title={<Typography.Text bold>{recipe.title}</Typography.Text>}
                        description={
                          <>
                            <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                              {recipe.summary}
                            </Typography.Paragraph>
                            <Space style={{ marginTop: 12 }}>
                              <Avatar size={20}>
                                <img src={recipe.creator?.avatarUrl} alt="avatar" />
                              </Avatar>
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {recipe.creator?.nickname}
                              </Typography.Text>
                            </Space>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                )) : <Typography.Text type="secondary" style={{ margin: '0 auto' }}>暂无推荐配方卡</Typography.Text>}
              </Row>
            </Skeleton>
          </div>
        </Col>

        {/* 右侧：侧边栏推荐 (7/24) */}
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <div className={styles.sidebar}>
            <Card title="🔥 精选创作者" bordered={false} className={styles.sidebarCard}>
              <Skeleton loading={loading} text={{ rows: 4 }} animation>
                {creators.length > 0 ? creators.map(creator => (
                  <div key={creator.id} className={styles.creatorItem}>
                    <Avatar size={40}><img src={creator.avatarUrl || ''} alt={creator.nickname} /></Avatar>
                    <div className={styles.creatorInfo}>
                      <Typography.Text bold>{creator.nickname}</Typography.Text>
                      <div className={styles.creatorDesc}>{creator.description || '暂无简介'}</div>
                    </div>
                  </div>
                )) : <Typography.Text type="secondary">暂无推荐创作者</Typography.Text>}
              </Skeleton>
            </Card>

            <Card title="💡 快速提示" bordered={false} className={styles.sidebarCard}>
              <Typography.Paragraph type="secondary" style={{ fontSize: 13 }}>
                • 您可以随时按下 <kbd style={{ padding: '2px 4px', background: 'var(--color-fill-2)', borderRadius: 4 }}>Cmd+K</kbd> 唤起全局搜索与分析框。<br/><br/>
                • 分析结果包含「钩子」、「情绪节奏」、「变现潜力」等 7 大维度，并提供可执行的建议。
              </Typography.Paragraph>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;