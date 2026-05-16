# 创谱 · Creagen 项目全局开发指令

## 1. Agent 行为规范与自我进化 (Meta Instructions)
- **实时更新指令约束**：在每次对话和代码修改过程中，你必须主动检测你所做出的更改方案、引入的新技术或建立的新规范是否与本指令文件的现有内容有出入。如果发现项目中确立了新的更优规范，你必须**实时主动更新本文件 (`.github/copilot-instructions.md`)**。
- **内容纯净性**：本文件仅用于存放全局静态规范、架构约定、UI/UX 原则和编码风格。**绝对不要**将诸如“待办事项(TODO)”、“开发计划”、“当前进度”等实时状态信息写入本文件（此类动态信息应存放在特定的 Session 内存或独立规划文件中）。

## 2. 项目概述
**创谱 · Creagen** 是一个旨在提取优秀创作者内容谱系，生成可学习创作蓝图的 Web 应用。通过输入视频 URL（如抖音精选），经过 AI 引擎分析并在前端呈现为结构化的「创作配方卡」。

## 3. 技术栈架构 (Tech Stack)
- **前端 (Frontend)**: React 18, TypeScript, Vite, Arco Design (核心 UI 组件库), Zustand (状态管理), React Router v7, Less / CSS Modules, Lucide React (图标)。
- **后端 (Backend)**: Node.js, Express v5, TypeScript, Sequelize (ORM), SQLite (数据库), OpenAI SDK (大模型), Swagger-UI-Express (API 文档)。
- **插件脚本**: Tampermonkey (`tampermonkey.user.js`) 用于在抖音精选网页端提供浮窗功能，抓取视频元数据与评论，并与系统通信。

## 4. 前端 UI/UX 与开发规范 (Frontend Guidelines)
- **UI 框架纯净度**：核心且唯一的 UI 框架必须是 **Arco Design**，**严禁引入 Tailwind CSS**。
- **深色模式与代码级样式**：
  - 必须使用 Arco Design 提供的 CSS 语义化变量（如 `var(--color-bg-2)`, `var(--color-text-1)`, `var(--color-border)`）编写所有自定义样式（Less/CSS Modules 中）。
  - 确保完美兼容深色模式。全站依靠 `document.body.setAttribute('arco-theme', 'dark')` 进行主题切换。
- **页面布局规则 (Modern Workbench)**：
  - 采用标准工作台布局：左侧边栏导航 (Sider)、顶部状态栏 (Header 包含面包屑及全局快捷工具)、主内容区 (Content 区块内部采用纯色卡片与底层背景对比)。
  - 内容区信息流（如 Home 页）：采用主次双栏布局（主内容瀑布流占约 17/24，侧边栏占 7/24），且在移动尺寸（`<md` / 768px）下自动折叠为单列。
  - 需要频繁操作的输入区域（如主页 URL 输入），应当做吸顶处理 (`position: sticky`) 并附加毛玻璃效果 (`backdrop-filter: blur`)。
- **全局快捷键交互**：支持 `Cmd+K` (Mac) / `Ctrl+K` (Win) 全局唤起搜索及快接输入弹窗。组件结构化化间距遵循 Arco 梯度（8px, 16px, 24px）。

## 5. 文案与标点排版规范 (Typography - 重要)
- **中文引号**：无论是前端界面的 UI 文字、输出给用户的交互文案，还是代码内的中文占位符/提示文本，**必须严格使用单直角引号「」和内嵌双直角引号『』**。绝对禁止使用传统的双引号（“”）和单引号（‘’）。
- **西文适配**：遇到全英文或代码逻辑环境，继续使用标准西文字符。中英文混排处应保持友好的间距感。

## 6. 后端与 AI 业务逻辑规范 (Backend & AI)
- **RESTful 与文档**：后端 API 需遵循 RESTful 规范，所有暴露给前端或扩展的接口必须在 `src/config/swagger.ts` 配置中及相应的 Route 处更新 OpenAPI 注释。
- **AI 编排策略 (`aiAnalyzer.ts` 等)**：
  - 必须支持配置自定义的 OpenAI 兼容端点（Base URL）和 API Key。
  - **上下文感知**：向大模型请求分析新视频时，除了发送当前视频的标题、简介、部分评论外，**必须包含该创作者此前已生成的「创作配方卡」作为上下文**。
  - **多维度输出**：AI 分析结果必须结构化，固定输出 7 个维度（内容定位、叙事结构、选题偏好、视觉风格、情绪节奏、差异化特征、观众互动模式），并附带 3-5 条对学习者可执行的行动建议。
- **数据层 (`models`)**：以 Sequelize 配置 Model (如 Creator, RecipeCard, Setting)，保证与 SQLite 的稳定连接。

## 7. 代码规范与代码库同步
- 当你 (AI Agent) 处理问题或重构代码时，必须先阅读现有代码中的组件和引用关系，不要重复引入依赖。
- 修改任何涉及全局布局或全局存储（Zustand、Arco ConfigProvider）的代码前，必须确保不破坏原有的深色模式切换和全局热键生态。