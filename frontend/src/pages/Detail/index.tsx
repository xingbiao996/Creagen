import React, { useEffect, useState } from 'react';
import { Card, Grid, Space, Button, Divider, Message, Skeleton } from '@arco-design/web-react';
import { IconLeft, IconShareAlt, IconStar, IconFire, IconBulb, IconLink } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@/components/Typography';
import styles from './index.module.less';

const { Row, Col } = Grid;

const dimNames: Record<string, string> = {
  hook: '内容定位 / 钩子',
  topic: '选题偏好',
  structure: '叙事结构',
  visuals: '视觉风格',
  emotion: '情绪节奏',
  cta: '观众互动模式',
  differentiation: '差异化特征'
};

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipe/${id}`);
        const data = await res.json();
        if (data.success) {
          setRecipe(data.data);
        } else {
          Message.error(data.error || '获取详情失败');
        }
      } catch (error) {
        Message.error('网络请求失败');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe && !loading) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>配方卡不存在</div>;
  }

  const dimensionsArray = recipe ? Object.entries(recipe.dimensions).map(([key, val]) => ({
    key,
    name: dimNames[key] || key,
    desc: val as string
  })) : [];

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <Button type="text" icon={<IconLeft />} onClick={() => navigate(-1)}>
          返回
        </Button>
        <Space>
          <Button type="outline" icon={<IconStar />}>收藏配方</Button>
          <Button type="primary" icon={<IconShareAlt />}>分享</Button>
        </Space>
      </div>

      <Skeleton loading={loading} text={{ rows: 10 }} animation>
        {recipe && (
          <Row gutter={24}>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Card className={styles.mainCard} bordered={false}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Typography.Title heading={2} style={{ margin: 0 }}>
                      {recipe.title}
                    </Typography.Title>
                    <Space style={{ marginTop: 16 }}>
                      <Typography.Text type="secondary">创作者：{recipe.creator?.nickname}</Typography.Text>
                      <a href={recipe.videoUrl} target="_blank" rel="noreferrer">
                        <Button type="text" size="small" icon={<IconLink />}>查看原视频</Button>
                      </a>
                    </Space>
                  </div>

                  <Divider />

                  <div>
                    <div className={styles.sectionTitle}>
                      <IconFire style={{ color: '#f53f3f' }} />
                      <Typography.Title heading={4} style={{ margin: 0 }}>核心拆解 (7大维度)</Typography.Title>
                    </div>
                    
                    <Grid.Row gutter={[24, 24]}>
                      {dimensionsArray.map((dim, index) => (
                        <Grid.Col xs={24} sm={24} md={12} lg={12} xl={12} key={index}>
                          <Card className={styles.dimensionCard}>
                            <div className={styles.dimHeader}>
                              <Typography.Text bold>{dim.name}</Typography.Text>
                            </div>
                            <Typography.Paragraph className={styles.dimDesc}>
                              {dim.desc}
                            </Typography.Paragraph>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid.Row>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card className={styles.scoreCard} bordered={false}>
                  <div className={styles.sectionTitle}>
                    <IconStar style={{ color: '#165dff' }} />
                    <Typography.Title heading={4} style={{ margin: 0 }}>内容摘要</Typography.Title>
                  </div>
                  <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
                    {recipe.summary}
                  </Typography.Paragraph>
                </Card>

                <Card className={styles.actionCard} bordered={false}>
                  <div className={styles.sectionTitle}>
                    <IconBulb style={{ color: '#ffb400' }} />
                    <Typography.Title heading={4} style={{ margin: 0 }}>行动建议</Typography.Title>
                  </div>
                  <ul className={styles.actionList}>
                    {(recipe.actionAdvice || []).map((action: string, index: number) => (
                      <li key={index}>
                        <Typography.Paragraph style={{ marginBottom: 0 }}>
                          {action}
                        </Typography.Paragraph>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Space>
            </Col>
          </Row>
        )}
      </Skeleton>
    </div>
  );
};

export default Detail;