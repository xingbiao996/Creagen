# UI 重构方案：现代工作台 (Modern Workbench)

## 1. 概述 (Summary)
根据 Arco Design 设计规范，将 Creagen WebApp 的前端 UI 从传统的“门户式上下布局”彻底重构为“现代工作台 (Workbench)”风格。本次重构将引入左侧边栏导航、顶部状态栏、主页吸顶输入框及双栏信息流布局，并补全深色模式、全局快捷键 (Cmd+K)、我的收藏、用户信息等核心功能模块，大幅提升系统的专业感与使用效率。

## 2. 当前状态分析 (Current State Analysis)
- **页面框架 (`PageLayout`)**: 目前采用顶栏 (Header 包含 Logo 和水平导航) + 内容区 + 底栏 (Footer) 的传统布局。对于工具类产品而言，空间利用率低，缺乏沉浸感。
- **主页 (`Home`)**: 单列铺满，顶部包含巨大的 Hero 区域和搜索框，下方分区块展示创作者和配方卡。信息层级扁平，无法在一屏内高效展示多维数据。
- **缺失功能**: 缺乏现代 SaaS 工具标配的深色模式 (Dark Mode)、全局快捷操作、个人中心以及收藏夹功能。

## 3. 建议更改方案 (Proposed Changes)

### 3.1 全局架构与导航重构
**文件**: `src/components/PageLayout/index.tsx`, `src/components/PageLayout/index.module.less`
- **左侧边栏 (Sider)**:
  - 放置 Creagen Logo。
  - 使用 Arco Design 的纵向 `<Menu>`，包含：`主页`、`我的收藏`、`历史记录`、`设置`。
  - 支持侧边栏折叠/展开。
- **顶部栏 (Header)**:
  - 左侧：当前页面的面包屑导航 (Breadcrumb)。
  - 中间/右侧：提供 `Cmd+K` 唤起全局输入的提示按钮。
  - 右侧：深浅色模式切换按钮 (Theme Toggle)、用户头像及下拉菜单 (Dropdown)。
- **内容区 (Content)**:
  - 使用 Arco 的标准底层背景色 (`var(--color-fill-2)`)，内部页面区块使用纯色卡片包裹，形成明显的层级和阴影对比。

### 3.2 补全核心功能与交互
**文件**: `src/store/index.ts`, `src/components/GlobalSearch/index.tsx` (新建)
- **深色模式 (Dark Mode)**:
  - 在全局状态中管理主题，切换时利用 Arco Design 的原生机制：`document.body.setAttribute('arco-theme', 'dark')`，确保所有组件自动切换配色。
- **全局快捷键 (Cmd+K)**:
  - 监听全局键盘事件 `Cmd+K` / `Ctrl+K`。
  - 触发后弹出 Arco `<Modal>`，内部包含大号的输入框，允许用户在任何页面直接粘贴抖音 URL 提交分析，或者搜索本地历史记录。

### 3.3 主页信息流与区域重新分配
**文件**: `src/pages/Home/index.tsx`, `src/pages/Home/index.module.less`
- **顶部吸顶输入栏 (Sticky Input Bar)**:
  - 移除原本占据大面积的 Hero 区域。
  - 在主页内容区顶部设计一个精致的 URL 输入栏。使用 CSS `position: sticky` 和毛玻璃背景 (`backdrop-filter: blur`)，使其在用户向下滚动查看信息流时，始终悬浮在内容区最上方，随时可进行输入分析。
- **主次双栏布局 (Two-column Dashboard Layout)**:
  - 采用 Arco 的 `<Grid.Row>` 和 `<Grid.Col>`。
  - **左侧 (占约 17/24)**: 主信息流 (Main Feed)。使用瀑布流或网格展示最新的“优秀创作配方卡”。
  - **右侧 (占约 7/24)**: 侧边栏 (Right Sidebar)。模块化展示“精选推荐创作者”、“数据概览”或“快捷操作”，形成主次分明的工作台视觉。

### 3.4 补充“我的收藏”页面
**文件**: `src/pages/Favorites/index.tsx` (新建), `src/router/index.tsx`
- 新增收藏页面结构，复用配方卡片组件，为用户提供一个专属的收藏工作区（前端 UI 先行搭建）。

## 4. 假设与决策 (Assumptions & Decisions)
- **UI 框架纯净度**: 继续保持纯 Arco Design + Less / CSS Modules 的开发模式，不引入 Tailwind CSS，严格通过 Arco 的 CSS 变量 (`var(--color-text-1)`, `var(--color-border)`) 编写样式，以完美兼容深色模式。
- **数据流**: “我的收藏”暂未有后端接口，本次重构将在前端搭建完善的 UI 页面及交互状态，数据可暂时使用 Mock 或本地状态。
- **响应式**: 双栏布局在屏幕宽度小于 `md` (通常为 768px 或 992px) 时，右侧边栏会自动折叠到主信息流下方，保证移动端体验。

## 5. 验证步骤 (Verification Steps)
1. **布局验证**: 确认整体呈现“左导航 + 上顶栏 + 右下内容区”的标准工作台架构。
2. **主题验证**: 点击顶部的“月亮/太阳”图标，确认全站所有组件、背景、字体颜色均平滑切换至深色模式，无白斑或样式穿透。
3. **快捷键验证**: 在任意页面按下 `Cmd+K`（Windows 为 `Ctrl+K`），确认能否成功唤起全局搜索/分析弹窗。
4. **主页滚动验证**: 向下滚动主页信息流，确认顶部的 URL 输入栏是否成功吸顶，且背景具有毛玻璃效果。
5. **规范验证**: 检查代码中的间距是否使用了 Arco 推荐的梯度（如 8px, 16px, 24px），颜色是否全部使用语义化变量。