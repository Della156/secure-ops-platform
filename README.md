# 🛡 网络安全智能化运维平台

> **当前状态：6 大模块 705 菜单 100% 完成 · 4 阶段后 MVP 优化 100% · Build 通过 · 演示就绪**

网络安全智能化运维 (Network Security Intelligent Operations) 平台是一个面向 SOC / 安全运维场景的一体化 Web 平台，覆盖**自动任务配置 → 自动运维 → 自动运营 → 标准场景自动化 → 人机协同工作台 → 运维配置中心** 6 大模块共 705 个功能菜单。

## ✨ 核心特性

- ✅ **6 大模块 705 菜单 100% 业务实现**（无占位）
- ✅ **统一 6 大工作台**（每模块 4 KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 + 实时事件流）
- ✅ **全局搜索**（Cmd+K 模糊匹配 705 菜单）
- ✅ **深/浅主题切换**（XSOAR 风格深色专业感 + 外壳可换）
- ✅ **5 维动态风险评分**（资产 30% + 告警 25% + 漏洞 20% + 合规 15% + 覆盖 10%）
- ✅ **事件总线 + 跨页面流转**（14 类业务事件，告警生命周期演示）
- ✅ **首页大屏化**（4 widget：实时威胁 / 风险评分 / 事件 KPI / 资产合规）
- ✅ **静态导出 + 一键部署**（`out/` → nginx）

## 🛠 技术栈

| 项 | 选型 |
|---|---|
| 框架 | **Next.js 14.2.29** (App Router) |
| 样式 | **Tailwind CSS v4** + CSS 变量 |
| 语言 | TypeScript |
| 状态 | React Context API（无 Redux/Zustand） |
| 图表 | recharts + SVG 手绘 |
| 图标 | lucide-react |
| 部署 | **静态导出** (`output: 'export'`) → nginx |

## 📊 项目规模

| 指标 | 数值 |
|------|------|
| 模块 | 6 大模块 |
| 菜单 | 705（6 一级 + 96 二级 + 603 三级） |
| 业务页面 | 610 个 pageRegistry entry（100% 真实实现） |
| 共享组件 | 4 大类（ListPage / PolicyEditor / TaskMonitor / FlowOrchestrator） |
| UI 组件 | 10 个（项目自定义，非 shadcn） |
| 自定义 Hooks | 6 个 |
| 文件数 | 790 `.tsx` |
| 代码行 | 157K |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 开发模式
npm run dev
# 打开 http://localhost:3000

# 3. 生产构建（静态导出）
npm run build
# → out/ 目录

# 4. 本地预览
npx serve@latest -s out -l 3000
```

## 🏗 项目结构

```
secure-ops-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # data-theme="dark" 根布局
│   │   ├── page.tsx
│   │   ├── globals.css         # XSOAR 主题 + CSS 变量
│   │   ├── error.tsx           # 全局错误边界
│   │   └── not-found.tsx       # 404
│   ├── components/
│   │   ├── Layout/             # MainLayout + TopHeader
│   │   ├── Sidebar/            # 3 级递归菜单
│   │   ├── Common/             # 共享业务组件
│   │   │   ├── GlobalSearch/   # Cmd+K 模糊搜索
│   │   │   ├── ThemeSwitcher/  # 深/浅/跟随
│   │   │   ├── ListPage/       # 通用列表
│   │   │   ├── PolicyEditor/   # 策略编辑
│   │   │   └── TaskMonitor/    # 任务监控
│   │   ├── FlowOrchestrator/   # 流程编排画布
│   │   ├── Dashboard/          # 首页 4 大屏 widget
│   │   ├── Pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── PageContent.tsx
│   │   │   ├── _shared/        # ModuleWorkbench / TodoCenter / RiskScoreCenter
│   │   │   ├── module1/        # 58 文件 / 17K 行
│   │   │   ├── module2/        # 267 文件 / 48K 行
│   │   │   ├── module3/        # 210 文件 / 36K 行
│   │   │   ├── module4/        # 101 文件 / 19K 行
│   │   │   ├── module5/        # 41 文件 / 12K 行
│   │   │   └── module6/        # 46 文件 / 8K 行
│   │   └── ui/                 # 10 项目 UI 组件
│   ├── contexts/SystemContext.tsx
│   ├── data/                   # menuData + pageRegistry
│   ├── hooks/                  # 6 自定义 hooks
│   ├── lib/eventBus.ts
│   ├── services/               # 风险引擎
│   └── types/                  # 核心 + 风险 + 事件类型
├── docs/                       # 设计规范 + 部署文档
├── scripts/                    # 部署脚本
├── CODING_PLAN.md              # 📋 详细编码计划与状态
├── next.config.mjs             # output: 'export'
└── package.json
```

## 📚 文档导航

- [CODING_PLAN.md](./CODING_PLAN.md) — **完整编码计划与项目状态**（推荐先读）
- [docs/STATIC-DEPLOY.md](./docs/STATIC-DEPLOY.md) — 静态部署到 nginx
- [docs/TRAE_PROMPT_设计规范.md](./docs/TRAE_PROMPT_设计规范.md) — Trae AI 生成页面规范
- [docs/TRAE_QUICK_设计规范.md](./docs/TRAE_QUICK_设计规范.md) — Trae 快速参考
- [docs/TRAE_PROMPT_模块1~6.md](./docs/) — 各模块设计指导

## 🎨 设计体系（XSOAR 冷调蓝灰）

```
背景:        #111625
表面/面板:    #181F32
卡片:        #20293F
边框/分割线:  #2A354D
主色:        #0066FF
AI 专用色:    #6366F1
成功:        #00C853
警告:        #FF9100
危险:        #FF3B30
主标题:      #F3F4F6
次要文字:    #9CA3AF
```

## 🧪 演示 Demo 路径

1. **首页大屏**（`/`）— 4 widget + 6 模块入口 + 实时告警 + 高优待办
2. **6 模块工作台**（点击 sidebar 1 级菜单）
3. **全局搜索**（Cmd+K）— 试试搜"防火墙""漏洞""编排器"
4. **主题切换**（右上角月亮图标）— 深 / 浅 / 跟随系统
5. **风险评分中心**（TopHeader "42 分"）
6. **高优待办**（TopHeader 铃铛）
7. **Module3Workbench 自动派发** — 进入自动触发 5 事件

## 📦 部署

```bash
npm run build
scp -r out/ user@server:/var/www/secure-ops-platform/

# nginx 配置（参考 docs/STATIC-DEPLOY.md）
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/secure-ops-platform/out;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 📝 License

MIT

---

**项目远程仓库**：[https://github.com/Della156/secure-ops-platform](https://github.com/Della156/secure-ops-platform)

**最新 commit**：`8d25f98` fix(search): GlobalSearch 1/2 级菜单点击跳到 firstChildId 3 级子菜单
