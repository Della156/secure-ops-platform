# 🗺 网络安全智能化运维平台 — 编码计划

> 最新更新: 2026-06-23 | 管理工具: AtomCode (deepseek-v4-flash) + Trae AI

---

## 一、项目概览

| 项目 | 说明 |
|------|------|
| 技术栈 | Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript |
| 设计规范 | XSOAR 冷调蓝灰深色主题 ✅ 已切换 |
| 源数据 | `网络安全智能化运维-原型1菜单.xlsx` — 6 个一级 / 96 个二级 / 602 个三级菜单 |
| 当前范围 | 模块 1「网络安全自动任务配置」— 14 个二级 / 57 个三级菜单 |
| 文件总数 | ~80 `.tsx`/`.ts` 文件 |

---

## 二、项目结构

```
secure-ops-platform/
├── src/
│   ├── app/
│   │   ├── globals.css               # XSOAR Design Tokens (点阵背景、极细滚动条)
│   │   ├── layout.tsx                # 根布局
│   │   └── page.tsx                  # 首页
│   ├── components/
│   │   ├── Layout/
│   │   │   └── MainLayout.tsx        # 主布局 (Sidebar + PageContent)
│   │   ├── Pages/
│   │   │   ├── PageRouter.tsx        # 页面路由调度器（从 registry 读取）
│   │   │   ├── PageContent.tsx       # 页面入口（包裹 PageShell + 面包屑）
│   │   │   └── module1/              # 57 个页面（按业务分组）
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MenuItem.tsx          # 递归菜单渲染（支持三级）
│   │   │   ├── RiskScoreCard.tsx
│   │   │   └── RiskBadge.tsx
│   │   ├── PageShell.tsx             # 统一页面壳（面包屑/标题/Loading/Error）
│   │   └── ui/                       # 🆕 UI 组件库（8 个组件）
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       ├── Card.tsx
│   │       ├── Empty.tsx
│   │       └── Loading.tsx
│   ├── contexts/
│   │   └── SystemContext.tsx
│   ├── data/
│   │   ├── menuData.ts               # 菜单配置数据（全部 6 个模块）
│   │   └── pageRegistry.tsx          # 🆕 页面注册表（动态导入，按需加载）
│   ├── types/
│   │   └── index.ts
│   └── index.ts (components)
├── CODING_PLAN.md
├── CONTRIBUTING.md                   # 🆕 模块开发规范指南
├── TRAE_PROMPT_模块1*.md
└── XSOAR_UPGRADE_GUIDE.md
```

---

## 三、完成状态

### ✅ Phase 1 — 基础设施（全部完成）

| 任务 | 文件 | 状态 |
|------|------|------|
| 项目初始化 | 脚手架 | ✅ |
| 菜单配置（6 模块全部） | `src/data/menuData.ts` | ✅ |
| 类型系统（三级菜单） | `src/types/index.ts` | ✅ |
| 全局状态管理 | `src/contexts/SystemContext.tsx` | ✅ |
| 侧边栏（折叠/三级递归） | `src/components/Sidebar/` | ✅ |
| 页面路由调度 | `PageRouter.tsx` → `pageRegistry.tsx` | ✅ |
| 统一页面壳 PageShell | `src/components/PageShell.tsx` | ✅ |
| UI 组件库（8 组件） | `src/components/ui/` | ✅ |
| 页面注册表（动态导入） | `src/data/pageRegistry.tsx` | ✅ |
| XSOAR 配色切换 | `globals.css` + 全文件替换 | ✅ |
| 模块开发规范指南 | `CONTRIBUTING.md` | ✅ |

### ✅ Phase 2 — 模块1 全部 57 个页面（Trae AI 生成）

| 组 | 页面数 | 覆盖 |
|----|--------|------|
| 1. 自动化任务注册与接入 | 3 | ✅ |
| 2. 自动化任务仓库与管理 | 2 | ✅ |
| 3. 自动化任务运行状态监控 | 6 | ✅ |
| 4. 可编排任务目录 | 3 | ✅ |
| 5. 自动化流程编排器 | 4 | ✅ |
| 6. 任务模板管理 | 4 | ✅ |
| 7. 任务调度引擎 | 3 | ✅ |
| 8. 任务执行与监控 | 4 | ✅ |
| 9. 安全设备资源管理 | 5 | ✅ |
| 10. 安全系统资源管理 | 5 | ✅ |
| 11. 主机资源管理 | 5 | ✅ |
| 12. 终端资源管理 | 5 | ✅ |
| 13. 数据接口对接管理 | 4 | ✅ |
| 14. 自动化服务接口配置 | 4 | ✅ |
| **合计** | **57** | **✅** |

### 🔜 Phase 3 — 后续模块（建议按优先级）

| 模块 | 二级菜单数 | 建议状态 | 优先级 |
|------|-----------|---------|--------|
| 模块2: 网络安全自动运维 | 34 | **下一阶段** | 🔴 高 |
| 模块5: 网络安全人机协同工作台 | 9 | 次优先 | 🟡 中 |
| 模块3: 网络安全自动运营 | 16 | 后续 | 🟢 正常 |
| 模块4: 网络安全标准场景自动化 | 10 | 后续 | 🟢 正常 |
| 模块6: 运维配置中心 | 13 | 最后 | ⚪ 低 |

---

## 四、架构设计

### 4.1 组件依赖关系

```
MainLayout
├── Sidebar
│   └── MenuItem (递归)
└── PageContent
    └── PageShell
        ├── 面包屑
        ├── 标题 + 操作按钮
        └── PageRouter
            └── [pageRegistry → 动态加载组件]
```

### 4.2 数据流

```
menuData.ts ───────────────▶  Sidebar / MenuItem
       │                          │
       │                    用户点击菜单项
       │                          │
       ▼                          ▼
pageRegistry.tsx ◀─── activeMenu ──┘
       │                 (SystemContext)
       ▼
PageRouter → PageComponent
```

### 4.3 添加新模块流程

```
1. 菜单配置     → menuData.ts 新增条目
2. 创建页面组件  → Pages/moduleX/YourPage.tsx
3. 注册页面      → pageRegistry.tsx 添加映射
4. 构建验证      → npm run build
```

---

## 五、设计体系（XSOAR 冷调蓝灰）

```
背景:       #111625
表面/面板:   #181F32
卡片:       #20293F
边框/分割线: #2A354D
主色:       #0066FF
AI 专用色:   #6366F1
成功:       #00C853
警告:       #FF9100
危险:       #FF3B30
主标题:     #F3F4F6
标签文字:   #D1D5DB
次要文字:   #9CA3AF
禁用文字:   #6B7280
字体:       Inter + JetBrains Mono (代码)
```

---

## 六、构建验证

```bash
cd secure-ops-platform
npm run build     # 当前通过 ✅
```

---

## 七、文件概览

| 类别 | 数量 | 说明 |
|------|------|------|
| 模块1 页面 | 57 | Trae AI 生成 + XSOAR 色值 |
| 组件/布局/壳 | 15 | Sidebar / UI lib / PageShell / Layout |
| 数据/类型/上下文 | 4 | menuData / pageRegistry / types / SystemContext |
| 配置文件 | 3 | globals.css / layout.tsx / page.tsx |
| 文档 | 5 | CODING_PLAN / CONTRIBUTING / TRAE_PROMPT / XSOAR_GUIDE / README |
