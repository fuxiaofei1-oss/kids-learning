# Web Game

一个基于 Phaser + TypeScript + Vite 开发的网页游戏。

## 技术栈

- **游戏框架**: [Phaser 3](https://phaser.io/)
- **语言**: TypeScript
- **构建工具**: Vite
- **CI/CD**: GitHub Actions
- **部署**: GitHub Pages

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式（热更新）

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可看到游戏。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## CI/CD 流程

本项目使用 GitHub Actions 实现自动化流程：

1. **代码推送 / PR 创建** → 自动触发
2. **代码检查** → ESLint 检查代码质量
3. **运行测试** → Vitest 单元测试
4. **构建** → 打包生成静态文件
5. **部署** → 自动部署到 GitHub Pages

## GitHub Pages 部署配置

1. 在 GitHub 仓库中，进入 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 推送代码到 main 分支后，会自动部署
4. 部署完成后可以在 `https://[你的用户名].github.io/[仓库名]/` 访问

## 项目结构

```
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions 配置
├── src/
│   └── main.ts                 # 游戏入口
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖配置
```

## 开发提示

- `src/main.ts` 是游戏入口，可以在这里添加你的场景和资源
- Phaser 官方文档: https://photonstorm.github.io/phaser3-docs/
- Vite 官方文档: https://vitejs.dev/
