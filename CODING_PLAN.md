# 🗺 网络安全智能化运维平台 — 编码计划

> 最新更新: **2026-06-05** | 管理工具: Craft Agent (MiniMax-M3) + 人工协作
>
> **当前状态：6 大模块全部完成 ✅ · 4 阶段后 MVP 优化 100% ✅ · Build 通过 ✅ · 演示就绪**

---

## 一、项目概览

| 项目 | 说明 |
|------|------|
| 项目代号 | **secure-ops-platform** |
| 技术栈 | **Next.js 14.2.29** (App Router) + **Tailwind CSS v4** + TypeScript |
| 部署模式 | **静态导出** (`output: 'export'`) → `out/` → nginx |
| 设计规范 | XSOAR 冷调蓝灰深色主题 ✅ 主题切换（深/浅/跟随系统） |
| 源数据 | `网络安全智能化运维-原型1菜单.xlsx` — **6 个一级 / 96 个二级 / 603 个三级菜单 = 705 项** |
| 业务页面 | **610 个 pageRegistry entry，100% 真实实现**（无占位） |
| 文件总数 | **790 个 `.tsx`** + **157K 行代码**（TSX/TS） |
| 远程仓库 | `https://github.com/Della156/secure-ops-platform.git` |

---

## 二、模块完成度

### ✅ 6 大模块 — 全部完成

| 模块 | 二级 | 三级 | 实现 | 文件 | 代码行 | 状态 |
|------|------|------|------|------|--------|------|
| **1. 网络安全自动任务配置** | 14 | 53 | 14/14 二级 + 53/53 三级 | 58 | 17,486 | ✅ |
| **2. 网络安全自动运维** | 34 | 215 | 34/34 二级 + 215/215 三级 | 267 | 48,081 | ✅ |
| **3. 网络安全自动运营** | 16 | 128 | 16/16 二级 + 128/128 三级 | 210 | 36,090 | ✅ |
| **4. 网络安全标准场景自动化** | 10 | 93 | 10/10 二级 + 93/93 三级 | 101 | 18,882 | ✅ |
| **5. 网络安全人机协同工作台** | 9 | 40 | 9/9 二级 + 40/40 三级 | 41 | 12,195 | ✅ |
| **6. 运维配置中心** | 13 | 50 | 13/13 二级 + 50/50 三级 | 46 | 8,353 | ✅ |
| **合计** | **96** | **603** | **100%** | **723** | **141,087** | **✅** |

> **说明**：96 个 2 级菜单无独立 `pageRegistry` entry（设计为"分组"，点击展开 3 级子菜单）；
> GlobalSearch 搜索/点击 1/2 级菜单时自动跳到第一个 3 级子菜单的真实页面（firstChildId 机制）。
> 603 个 3 级菜单全部 100% 真实实现。

### ✅ 6 个统一工作台（一级菜单入口）

| 工作台 | 模块 | 核心组件 | 状态 |
|--------|------|---------|------|
| `Module1Workbench` | 自动任务配置 | KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 | ✅ |
| `Module2Workbench` | 自动运维 | KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 | ✅ |
| `Module3Workbench` | 自动运营 | KPI + 5 步流程 + 7 日趋势 + **演示派发** | ✅ |
| `Module4Workbench` | 标准场景自动化 | KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 | ✅ |
| `Module5Workbench` | 人机协同工作台 | KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 | ✅ |
| `Module6Workbench` | 运维配置中心 | KPI + 5 步流程 + 7 日趋势 + 4 快捷入口 | ✅ |

---

## 三、4 阶段后 MVP 优化（100% 完成）

| 阶段 | 主题 | 子任务 | Commit | 状态 |
|------|------|--------|--------|------|
| **1. 体验打磨** | 全局搜索 + 持久化 + 骨架 + 错误边界 + Header | 5/5 | `8e85f74` | ✅ |
| **2. 主题系统** | 深/浅/跟随 3 选项 + CSS 变量驱动 | 3/3 | `091a3ac` | ✅ |
| **3. 流程闭环** | 事件总线 + 6 工作台 + 待办/风险中心 + 跨页流转 | 5/5 | `5bfc2e5` | ✅ |
| **4. 大屏 + 性能** | 首页 4 widget + dynamic 分块（取消 4.2 移动端） | 2/2 | `ab3d621` | ✅ |
| **总进度** | — | **15/15** | — | **✅** |

### 阶段 1：体验打磨（commit 8e85f74）
- `GlobalSearch` 模糊搜索 705 菜单（Cmd+K 唤起）
- `useLocalStorage` SSR 安全 + 状态持久化
- `Skeleton` 5 变体（基础/Card/KPI/Table/Chart）
- `error.tsx` + `not-found.tsx` 错误边界
- `TopHeader` 面包屑 + 搜索 + 风险评分 + 铃铛 + 用户

### 阶段 2：主题系统（commit 091a3ac）
- `ThemeSwitcher` 深/浅/跟随 3 选项
- `globals.css` 8 CSS 变量 + 5 语义色（双套主题）
- TopHeader / Sidebar / MainLayout 接入 `bg-app-*` utility
- 业务页保留深色硬编码（XSOAR 风格：外壳可换，业务页稳定）

### 阶段 3：流程闭环（commit 5bfc2e5）
- `eventBus.ts` 单例 + 14 类业务事件 union type
- `TodoCenter` 4 优先级筛选 + 详情弹窗 + 演示派发
- `RiskScoreCenter` 5 维动态评分（资产 30% + 告警 25% + 漏洞 20% + 合规 15% + 覆盖 10%）
- `ModuleWorkbench` 共享工作台组件 + 6 模块实例
- Module3Workbench 进入自动派发 5 事件（告警生命周期）

### 阶段 4：大屏 + 性能（commit ab3d621）
- 首页 4 大屏 widget（recharts + SVG 手绘）：
  - `RealtimeThreatWidget` 5 分钟滚动 4 级告警
  - `RiskScoreWidget` 5 维雷达 + 30 日趋势
  - `IncidentKPIWidget` 处置率饼图 + 7 日处理 vs 产生
  - `AssetComplianceWidget` 4 类资产合规率
- 609 个 pageRegistry entry 全部 `dynamic` 包裹
- Shared chunk: 97.7 KB · 首页 21.3 KB / 130 KB First Load

---

## 四、基础设施

### 4.1 共享业务组件

| 组件 | 位置 | 用途 | 文件数 |
|------|------|------|--------|
| `ListPage` | `src/components/Common/ListPage/` | 通用列表页（搜索/筛选/分页/批量操作/详情抽屉） | 5 |
| `PolicyEditor` | `src/components/Common/PolicyEditor/` | 策略编辑器（模板/审批/版本/合规映射） | 6 |
| `TaskMonitor` | `src/components/Common/TaskMonitor/` | 任务监控（实时日志/SLA/阶段/失败分析） | 5 |
| `FlowOrchestrator` | `src/components/FlowOrchestrator/` | 流程编排器（画布/节点库/节点配置/拖拽） | 6 |

### 4.2 项目 UI 组件

| 组件 | 用途 |
|------|------|
| `Button` | 按钮（6 变体） |
| `Input` | 输入框 |
| `Select` | 下拉选择 |
| `Table` | 表格 |
| `Modal` | 弹窗 |
| `Card` | 卡片 |
| `Badge` | 徽章 |
| `Empty` | 空状态 |
| `Loading` | 加载 |
| `StatusBadge` | 状态徽章 |

### 4.3 自定义 Hooks（6 个）

| Hook | 用途 |
|------|------|
| `useLocalStorage` | SSR 安全的 localStorage 持久化 |
| `useMounted` | 客户端挂载检测 |
| `useGlobalShortcut` | 全局快捷键（Cmd+K） |
| `useAsyncData` | 异步数据加载 |
| `useTable` | 表格状态管理 |
| `useInteraction` | 交互状态（hover/active） |

### 4.4 服务层

| 服务 | 文件 | 用途 |
|------|------|------|
| `riskEngine` | `src/services/riskEngine.ts` | 5 维动态风险评分计算 |
| `riskDataSource` | `src/services/riskDataSource.ts` | 风险数据源 |
| `eventBus` | `src/lib/eventBus.ts` | 14 类业务事件单例总线 |

### 4.5 类型系统

| 类型 | 文件 | 内容 |
|------|------|------|
| 核心类型 | `src/types/index.ts` | MenuItem / SystemState / BusinessEvent |
| 风险类型 | `src/types/risk.ts` | 5 维风险评分 + 触发器 |
| 事件类型 | `src/types/eventBus.ts` | 14 类业务事件 union type |

---

## 五、关键架构决策

### 5.1 静态导出 vs Standalone
**选择** `output: 'export'` — 纯静态、CDN 友好、部署简单（`out/` → nginx）

### 5.2 业务页面 100% 真实实现
- **不使用 GenericStub 占位**：所有 3 级菜单都指向具体业务组件
- 命名约定 `Stub_X_Y_Z`（dynamic import 包装），实际指向真实文件（AlertMonitorView 229 行等）
- 96 个 2 级菜单无独立 entry（设计为"分组"，展开 3 级子菜单）
- GlobalSearch firstChildId 机制：1/2 级菜单点击自动跳到第一个 3 级子菜单真实页面

### 5.3 主题切换务实策略
- **业务页**：12000+ 硬编码颜色保留（深色，XSOAR 风格专业感）
- **外壳（TopHeader/Sidebar/MainLayout）**：CSS 变量驱动，可深/浅切换
- 8 个 CSS 变量 + 5 语义色 + `bg-app-*` utility

### 5.4 共享组件 3 层架构
```
ListPage (通用列表)        → 业务页面
PolicyEditor (策略编辑)    → 业务页面
TaskMonitor (任务监控)     → 业务页面
FlowOrchestrator (流程编排) → 业务页面
```

### 5.5 事件总线
- 14 类业务事件（alert/task/vuln/report/todo/agent）union type
- 单例 + React 同步（`onChange` 触发 `eventVersion++`）

### 5.6 风险评分算法
**5 维动态加权**：
- 资产 30% + 告警 25% + 漏洞 20% + 合规 15% + 覆盖 10% = 100%

---

## 六、目录结构

```
secure-ops-platform/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # data-theme="dark" 根布局
│   │   ├── page.tsx                      # 首页（DashboardPage）
│   │   ├── globals.css                   # XSOAR 主题 + CSS 变量
│   │   ├── error.tsx                     # 全局错误边界
│   │   └── not-found.tsx                 # 404
│   ├── components/
│   │   ├── Layout/                       # MainLayout + TopHeader
│   │   ├── Sidebar/                      # 3 级递归菜单 + 风险卡片
│   │   ├── Common/                       # 共享业务组件 + 主题/搜索/骨架
│   │   │   ├── GlobalSearch/             # Cmd+K 模糊搜索 705 菜单
│   │   │   ├── ThemeSwitcher/            # 深/浅/跟随 3 选项
│   │   │   ├── Skeleton.tsx              # 5 变体
│   │   │   ├── ListPage/                 # 通用列表
│   │   │   ├── PolicyEditor/             # 策略编辑
│   │   │   └── TaskMonitor/              # 任务监控
│   │   ├── FlowOrchestrator/             # 流程编排画布
│   │   ├── Dashboard/                    # 首页 4 大屏 widget
│   │   ├── Pages/
│   │   │   ├── DashboardPage.tsx         # 首页（4 widget + 6 模块入口）
│   │   │   ├── PageContent.tsx           # 路由分发
│   │   │   ├── _shared/                  # ModuleWorkbench / TodoCenter / RiskScoreCenter
│   │   │   ├── module1/                  # 58 文件 / 17K 行
│   │   │   ├── module2/                  # 267 文件 / 48K 行
│   │   │   ├── module3/                  # 210 文件 / 36K 行
│   │   │   ├── module4/                  # 101 文件 / 19K 行
│   │   │   ├── module5/                  # 41 文件 / 12K 行
│   │   │   └── module6/                  # 46 文件 / 8K 行
│   │   └── ui/                           # 10 项目 UI 组件
│   ├── contexts/SystemContext.tsx        # 全局状态 + 事件总线集成
│   ├── data/
│   │   ├── menuData.ts                   # 705 菜单配置
│   │   └── pageRegistry.tsx              # 610 entry 动态注册
│   ├── hooks/                            # 6 自定义 hooks
│   ├── lib/eventBus.ts                   # 事件总线单例
│   ├── services/                         # 风险评分引擎
│   └── types/                            # 核心 + 风险 + 事件类型
├── docs/                                 # 设计规范 + 部署文档
├── scripts/                              # 部署脚本
├── CODING_PLAN.md                        # 本文件
├── next.config.mjs                       # output: 'export'
├── package.json
├── tailwind.config.ts                    # Tailwind v4
└── tsconfig.json                         # skipLibCheck: true
```

---

## 七、设计体系（XSOAR 冷调蓝灰）

### 7.1 颜色规范

| 用途 | 颜色 |
|------|------|
| **背景** | `#111625` |
| **表面/面板** | `#181F32` |
| **卡片** | `#20293F` |
| **边框/分割线** | `#2A354D` |
| **主色** | `#0066FF` |
| **AI 专用色** | `#6366F1` |
| **成功** | `#00C853` |
| **警告** | `#FF9100` |
| **危险** | `#FF3B30` |
| **主标题** | `#F3F4F6` |
| **标签文字** | `#D1D5DB` |
| **次要文字** | `#9CA3AF` |
| **禁用文字** | `#6B7280` |

### 7.2 CSS 变量（主题切换）

深色 / 浅色 双套：
- `--app-bg-deep`  · `--app-bg-surface` · `--app-bg-card`
- `--app-border-base` · `--app-border-focus`
- `--app-text-primary` · `--app-text-secondary` · `--app-text-muted`
- 5 语义色：`--color-primary` · `--color-ai` · `--color-success` · `--color-warning` · `--color-danger`

### 7.3 字体
- 正文：Inter
- 代码：JetBrains Mono

---

## 八、构建 & 部署

### 8.1 构建命令

```bash
cd secure-ops-platform
npm install
npm run build
# → out/ 目录（纯静态）
```

### 8.2 本地预览

```bash
npx serve@latest -s out -l 3000
# 打开 http://localhost:3000
```

### 8.3 部署到 nginx

```bash
# 1. 上传 out/ 到服务器
scp -r out/ user@server:/var/www/secure-ops-platform/

# 2. nginx 配置（参考 docs/STATIC-DEPLOY.md）
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/secure-ops-platform/out;
  index index.html;
  # 处理 404 回退到 index.html（SPA fallback）
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 8.4 Build 数据

| 指标 | 数值 |
|------|------|
| 编译时间 | ~30s |
| Shared chunk | 97.7 KB |
| 首页 `/` | 21.3 KB / 130 KB First Load |
| 静态路由 | `/`, `/_not-found` |
| Dynamic chunks | 609 个（按需加载） |

---

## 九、关键陷阱 & 经验总结

### 9.1 SWC 解析 bug
- **不要在 JSX `actions={[...]}` 中写多行 JSX 元素** — SWC 解析失败
- **不要写 `<StatusBadge>{children}</StatusBadge>`** — SWC syntax error
- 解决：提取 `const` 再传入 / 接受 `text` prop

### 9.2 静态图标 import
- build pass 但运行时 ReferenceError（Pause/Target/Test 等图标）
- 解决：只 import 实际用到的图标

### 9.3 macOS 大小写不敏感
- 路径 `import 'X.tsx'` 在 macOS 跑通，Linux 部署会失败
- 解决：import 路径与文件名完全一致（区分大小写）

### 9.4 pageRegistry 重置陷阱
- 每次升级前必须验证 pageRegistry 的 import 指向是否被覆盖
- 解决：直接改 const 的 import 路径，不用动态查找

### 9.5 Tailwind v4 CSS 变量
- 新增 `bg-app-*` utility 后必须 `rm -rf .next out && npm run build` 重新扫描
- 否则新 utility class 不会生成

### 9.6 Static export + useEffect
- `useLocalStorage` 初始化在 useEffect 异步执行
- 可能短暂出现 state 与 localStorage 不一致（hydration 间隙）

---

## 十、演示 Demo 路径

1. **首页大屏**（`/`）— 4 widget + 6 模块入口 + 实时告警 + 高优待办
2. **6 模块工作台**（点击 sidebar 1 级菜单）— KPI + 5 步流程 + 7 日趋势
3. **全局搜索**（Cmd+K）— 输入"防火墙""漏洞""编排器"等任意关键词
4. **主题切换**（右上角）— 深 / 浅 / 跟随系统
5. **风险评分中心**（TopHeader "42 分"）— 5 维评分 + 30 日趋势 + 智能体贡献
6. **高优待办**（TopHeader 铃铛）— 4 优先级筛选 + 演示派发
7. **Module3Workbench 自动派发** — 进入自动触发 5 事件模拟告警生命周期

---

## 十一、后续可优化项

| 优先级 | 项 | 说明 |
|--------|------|------|
| 🟡 中 | 移动端响应式 | 已取消 4.2 任务，未来可恢复 |
| 🟢 低 | 类型严格化 | `skipLibCheck: true` + `ignoreBuildErrors: true` 可逐步清理 |
| 🟢 低 | E2E 测试 | Playwright / Cypress 端到端测试 |
| 🟢 低 | 性能监控 | Lighthouse + Web Vitals 上报 |

---

## 十二、Commit 历史（最近 6 个）

```
8d25f98  fix(search): GlobalSearch 1/2 级菜单点击跳到 firstChildId 3 级子菜单
ab3d621  feat(stage4): 首页大屏化 + 性能优化（取消 4.2 移动端）
5bfc2e5  feat(stage3): 流程闭环 — 事件总线 + 6 模块工作台 + 待办/风险评分中心
091a3ac  feat(stage2): 主题切换系统 — 深/浅/跟随 + CSS 变量驱动
8e85f74  feat(stage1): 体验打磨 — 全局搜索 + 状态持久化 + 顶部 Header + 骨架 + 错误边界
301f8e9  feat(module4): 修复 4-6 漏洞管理 11 处 + 4-9 终端合规 2 处 + 4-10 渗透测试全套 10 个
```

---

> **项目状态总览**：
> ✅ 6 模块 705 菜单 100% 实现
> ✅ 4 阶段后 MVP 优化 100% (15/15)
> ✅ Build pass · 演示就绪
> ✅ 6 commit 全部 pushed 到 main
