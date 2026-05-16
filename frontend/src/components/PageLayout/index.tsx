import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown, Space } from '@arco-design/web-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  IconHistory, 
  IconHome, 
  IconThunderbolt, 
  IconSettings,
  IconStar,
  IconMoonFill,
  IconSunFill,
  IconUser,
  IconSearch
} from '@arco-design/web-react/icon';
import GlobalLoading from '@/components/GlobalLoading';
import GlobalSearch from '@/components/GlobalSearch';
import { useSettingsStore } from '@/store/settings';
import { useAppStore } from '@/store';
import styles from './index.module.less';

const { Header, Content, Sider } = Layout;
const MenuItem = Menu.Item;

const routeNameMap: Record<string, string> = {
  '/': '主页',
  '/history': '历史记录',
  '/favorites': '我的收藏',
  '/settings': '设置'
};

const PageLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchSettings } = useSettingsStore();
  const { theme, setTheme } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Determine breadcrumb
  const currentPath = location.pathname;
  const breadcrumbName = routeNameMap[currentPath] || (currentPath.startsWith('/detail/') ? '配方卡详情' : '');

  const triggerCmdK = () => {
    const event = new KeyboardEvent('keydown', { metaKey: true, key: 'k' });
    window.dispatchEvent(event);
  };

  return (
    <Layout className={styles.layout}>
      <GlobalLoading />
      <GlobalSearch />
      
      <Sider 
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
      >
        <div className={styles.logo} onClick={() => navigate('/')}>
          <IconThunderbolt style={{ color: 'var(--arcoblue-6)', fontSize: 24, marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span className={styles.logoText}>Creagen</span>}
        </div>
        <Menu
          selectedKeys={[currentPath.startsWith('/detail/') ? '/' : currentPath]}
          onClickMenuItem={(key) => navigate(key)}
          className={styles.menu}
        >
          <MenuItem key="/">
            <IconHome /> {!collapsed && '主页'}
          </MenuItem>
          <MenuItem key="/favorites">
            <IconStar /> {!collapsed && '我的收藏'}
          </MenuItem>
          <MenuItem key="/history">
            <IconHistory /> {!collapsed && '历史记录'}
          </MenuItem>
          <MenuItem key="/settings">
            <IconSettings /> {!collapsed && '设置'}
          </MenuItem>
        </Menu>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Breadcrumb>
              <Breadcrumb.Item key="home">Creagen</Breadcrumb.Item>
              {breadcrumbName && <Breadcrumb.Item key="current">{breadcrumbName}</Breadcrumb.Item>}
            </Breadcrumb>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.cmdButton} onClick={triggerCmdK}>
              <IconSearch />
              <span>搜索或分析...</span>
              <kbd>⌘K</kbd>
            </div>
            
            <Button 
              shape="circle" 
              type="text" 
              icon={theme === 'dark' ? <IconSunFill /> : <IconMoonFill />}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />

            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="1">个人信息</Menu.Item>
                  <Menu.Item key="2">退出登录</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <Avatar size={32} style={{ backgroundColor: 'var(--color-primary-light-4)', cursor: 'pointer' }}>
                <IconUser />
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        
        <Layout className={styles.contentWrapper}>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageLayout;