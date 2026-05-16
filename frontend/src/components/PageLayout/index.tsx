import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown } from '@arco-design/web-react';
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
  IconSearch,
  IconMenu
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
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentPath = location.pathname;
  const breadcrumbName = routeNameMap[currentPath] || (currentPath.startsWith('/detail/') ? '配方卡详情' : '');

  const triggerCmdK = () => {
    const event = new KeyboardEvent('keydown', { metaKey: true, key: 'k' });
    window.dispatchEvent(event);
  };

  const handleNavigate = (key: string) => {
    navigate(key);
    setMobileMenuVisible(false);
  };

  const menuItems = [
    { key: '/', icon: <IconHome />, label: '主页' },
    { key: '/favorites', icon: <IconStar />, label: '收藏' },
    { key: '/history', icon: <IconHistory />, label: '历史' },
    { key: '/settings', icon: <IconSettings />, label: '设置' },
  ];

  return (
    <Layout className={styles.layout}>
      <GlobalLoading />
      <GlobalSearch />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuVisible && (
        <div 
          className={styles.siderOverlay} 
          onClick={() => setMobileMenuVisible(false)}
        />
      )}
      
      <Sider 
        className={`${styles.sider} ${mobileMenuVisible ? styles.siderVisible : ''}`}
        collapsible={!isMobile}
        collapsed={isMobile ? false : collapsed}
        onCollapse={isMobile ? () => {} : setCollapsed}
        width={220}
      >
        <div className={styles.logo} onClick={() => handleNavigate('/')}>
          <IconThunderbolt style={{ color: 'var(--arcoblue-6)', fontSize: 24, marginRight: (isMobile ? false : collapsed) ? 0 : 8 }} />
          {!(isMobile ? false : collapsed) && <span className={styles.logoText}>Creagen</span>}
        </div>
        <Menu
          selectedKeys={[currentPath.startsWith('/detail/') ? '/' : currentPath]}
          onClickMenuItem={handleNavigate}
          className={styles.menu}
        >
          <MenuItem key="/">
            <IconHome /> {!(isMobile ? false : collapsed) && '主页'}
          </MenuItem>
          <MenuItem key="/favorites">
            <IconStar /> {!(isMobile ? false : collapsed) && '我的收藏'}
          </MenuItem>
          <MenuItem key="/history">
            <IconHistory /> {!(isMobile ? false : collapsed) && '历史记录'}
          </MenuItem>
          <MenuItem key="/settings">
            <IconSettings /> {!(isMobile ? false : collapsed) && '设置'}
          </MenuItem>
        </Menu>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            {/* Mobile Menu Button */}
            <div 
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuVisible(true)}
            >
              <IconMenu style={{ fontSize: 20 }} />
            </div>
            
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
      
      {/* Mobile Bottom Navigation */}
      <div className={styles.bottomNav}>
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`${styles.bottomNavItem} ${
              (currentPath.startsWith('/detail/') ? '/' : currentPath) === item.key 
                ? styles.bottomNavItemActive 
                : ''
            }`}
            onClick={() => handleNavigate(item.key)}
          >
            {item.icon}
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default PageLayout;
