import React from 'react';
import { Empty, Typography } from '@arco-design/web-react';
import { IconStar } from '@arco-design/web-react/icon';
import styles from './index.module.less';

const Favorites: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.Title heading={3}>我的收藏</Typography.Title>
      <Typography.Paragraph type="secondary">
        您收藏的优秀创作配方卡将在这里展示。
      </Typography.Paragraph>
      
      <div className={styles.empty}>
        <Empty 
          icon={<IconStar style={{ fontSize: 48, color: 'var(--color-text-3)' }} />}
          description="暂无收藏的配方卡，去主页看看吧！"
        />
      </div>
    </div>
  );
};

export default Favorites;