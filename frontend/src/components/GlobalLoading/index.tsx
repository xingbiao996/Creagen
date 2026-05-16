import React from 'react';
import { Spin } from '@arco-design/web-react';
import { useAppStore } from '@/store';
import styles from './index.module.less';

const GlobalLoading: React.FC = () => {
  const { globalLoading, globalLoadingText } = useAppStore();

  if (!globalLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <Spin dot tip={globalLoadingText || '正在努力加载中...'} size={32} />
      </div>
    </div>
  );
};

export default GlobalLoading;