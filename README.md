# 创谱 · Creagen

提取优秀创作者的内容谱系，生成可学习的创作蓝图。

## 产品简介

新手创作者在学习优秀视频时往往只能看到表象，缺乏系统性的拆解框架。**创谱 · Creagen** 通过自动化提取视频数据并运用大模型（LLM）进行结构化深度分析，为用户提供一套清晰的创作配方，降低学习门槛，提升创作质量。

目前，Creagen 通过 Tampermonkey (油猴) 扩展支持对「抖音精选」网页版的内容进行一键提取分析。

## 核心特性

- **多渠道视频解析**：通过 Tampermonkey 脚本快捷提取视频元数据（标题、简介、评论等）。
- **上下文感知 AI 分析**：基于创作者历史的「创作配方卡」进行上下文连贯分析，固定输出 7 大内容维度：
  1. 内容定位
  2. 叙事结构
  3. 选题偏好
  4. 视觉风格
  5. 情绪节奏
  6. 差异化特征
  7. 观众互动模式
- **现代工作台 UI (Modern Workbench)**：基于 Arco Design 打造了专业的双栏流式布局，支持全局深色模式，并自带全局快捷键 (`Cmd+K` / `Ctrl+K`) 操作。
- **本地持久化**：分析结果与配置都基于 SQLite 本地化持久保存。
- **自定义模型端点**：支持接入各类兼容 OpenAI API 规范的大模型接口（Base URL、API Key 可自定义）。

## 技术栈

- **前端**: React 18, TypeScript, Vite, Arco Design, Zustand, React Router v7, Less
- **后端**: Node.js, Express v5, TypeScript, Sequelize (ORM), SQLite, OpenAI SDK
- **浏览器插件**: Tampermonkey UserScript (JavaScript)

## 快速开始

### 1. 启动后端服务
```bash
cd backend
npm install
# 启动开发服务器 (运行在指定的后端端口)
npm run dev
```

### 2. 启动前端页面
```bash
cd frontend
npm install
# 启动前端页面 (Vite 默认运行在 5173 端口)
npm run dev
```

### 3. 安装浏览器扩展
1. 在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/) 插件。
2. 将项目根目录下的 `tampermonkey.user.js` 代码添加为新的用户脚本。
3. 访问并打开相关视频网页（如抖音精选），您将在页面上看到 Creagen 的浮窗面板，可以直接点击“提取并发送至 Creagen”进行分析。

## 开发规范

本项目遵循严格的排版与代码规范（详见 `.github/copilot-instructions.md`）：
- **UI/UX 纯净度**：前端组件基于纯 Arco Design，系统级适配深色模式，严禁混用 Tailwind CSS。
- **中文排版**：严格使用单直角引号「」和内嵌双直角引号『』，避免使用传统引号（“”和‘’）。

## 开源协议

本项目基于 MIT 协议开源。详情请参阅 [LICENSE](LICENSE) 文件。
