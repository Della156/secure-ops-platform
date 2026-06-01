# 🗺 网络安全智能化运维平台 — 编码计划

> 最新更新: 2026-05-29 | 管理工具: AtomCode (deepseek-v4-flash) + Trae AI

---

## 一、项目概览

| 项目 | 说明 |
|------|------|
| 技术栈 | Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript |
| 设计规范 | 深色工业风 (当前 Tailwind Slate → 待升级 XSOAR 冷蓝灰) |
| 源数据 | `网络安全智能化运维-原型1菜单.xlsx` — 6 个一级 / 96 个二级 / 602 个三级菜单 |
| 当前范围 | 模块 1「网络安全自动任务配置」— 14 个二级 / 57 个三级菜单 |

---

## 二、项目结构总览

```
secure-ops-platform/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # Tailwind v4 主题变量 + Design Tokens
│   │   └── layout.tsx                # 根布局 (SystemProvider + MainLayout)
│   ├── components/
│   │   ├── Layout/
│   │   │   └── MainLayout.tsx        # 主布局 (Sidebar + PageContent)
│   │   ├── Pages/
│   │   │   └── PageContent.tsx       # 内容路由 & 默认首页
│   │   └── Sidebar/
│   │       ├── Sidebar.tsx           # 侧边栏框架
│   │       ├── MenuItem.tsx          # 递归菜单渲染 (支持三级)
│   │       ├── RiskScoreCard.tsx     # 风险评分卡
│   │       └── RiskBadge.tsx         # 风险标签
│   ├── contexts/
│   │   └── SystemContext.tsx         # 全局状态 (activeMenu, riskScore, todos)
│   ├── data/
│   │   └── menuData.ts              # 菜单配置数据 (全部 6 个模块)
│   ├── types/
│   │   └── index.ts                 # MenuItem / SubMenuItem 类型定义
│   └── pages/
│       └── module1/
│           ├── PageRouter.tsx        # 模块1 页面路由映射 (57 个页面)
│           ├── taskRegistration/     # 3 个页面
│           ├── taskRepository/       # 2 个页面
│           ├── taskMonitor/          # 6 个页面
│           ├── orchestrationDir/     # 3 个页面
│           ├── flowEditor/           # 4 个页面
│           ├── templateManager/      # 4 个页面
│           ├── scheduler/            # 3 个页面
│           ├── executionMonitor/     # 4 个页面
│           ├── resourceManagement/   # 20 个页面 (device/system/host/endpoint)
│           ├── dataIntegration/      # 4 个页面
│           └── apiService/           # 4 个页面
```

**当前计数**: 73 个 `.tsx` 文件 (58 页面 + 6 组件 + 5 布局/路由/上下文 + 4 其他)

---

## 三、完成状态

### ✅ 已完成 (Phase 1 — 基础设施)

| 任务 | 状态 | 文件 |
|------|------|------|
| 项目初始化 (Next.js + Tailwind) | ✅ | 脚手架 |
| 菜单数据配置 (6 模块全部) | ✅ | `src/data/menuData.ts` |
| 类型系统 (三级菜单支持) | ✅ | `src/types/index.ts` |
| 全局状态管理 | ✅ | `src/contexts/SystemContext.tsx` |
| 侧边栏 (折叠/展开 + 三级菜单) | ✅ | `src/components/Sidebar/` |
| 页面路由调度 | ✅ | `src/components/Pages/PageContent.tsx` |
| 模块1 页面路由表 | ✅ | `src/pages/module1/PageRouter.tsx` |

### ✅ 已完成 (Phase 2 — 模块1 全部 57 个页面，Trae AI 生成)

| 组 | 页面数 | 页面 |
|----|--------|------|
| 1. 自动化任务注册与接入 | 3 | TaskAccessManagement, TaskOnlineRegistration, TaskAccessStatus |
| 2. 自动化任务仓库与管理 | 2 | TaskVersionManagement, TaskShelfManagement |
| 3. 自动化任务运行状态监控 | 6 | TaskRunStatusList, TaskRunStatistics, TaskRunMonitor, TaskResourceMonitor, TaskExceptionAnalysis, TaskAlertManagement |
| 4. 可编排任务目录 | 3 | AbilitySearchBrowse, ServiceAuthConfig, ApiDocView |
| 5. 自动化流程编排器 | 4 | FlowOrchestration, NodeLibrary, LogicControlNode, FlowDebugSimulation |
| 6. 任务模板管理 | 4 | TemplateCreateSave, TemplateParamConfig, TemplateCategoryTag, TemplateImportInstance |
| 7. 任务调度引擎 | 3 | TriggerModeConfig, PriorityManagement, ResourcePoolConfig |
| 8. 任务执行与监控 | 4 | GlobalProgressView, NodeExecutionLog, RunControl, ExecutionAudit |
| 9. 安全设备资源管理 | 5 | DeviceList, DeviceConnectTest, DeviceAuthManagement, DeviceServiceView, DeviceAccessLog |
| 10. 安全系统资源管理 | 5 | SystemList, SystemConnectTest, SystemAuthManagement, SystemApiView, SystemAccessLog |
| 11. 主机资源管理 | 5 | HostList, HostConnectTest, HostAuthManagement, HostCommandView, HostAccessLog |
| 12. 终端资源管理 | 5 | EndpointList, EndpointConnectTest, EndpointAuthManagement, EndpointCommandView, EndpointAccessLog |
| 13. 数据接口对接管理 | 4 | InterfaceConfig, InterfaceConnectTest, InterfaceCallLog, InterfacePerformance |
| 14. 自动化服务接口配置 | 4 | ApiInterfaceConfig, ApiAccessAuth, ApiCallLog, ApiCallAnalysis |
| **合计** | **57** | |

### ⏳ 待完成 (Phase 3 — 设计升级)

| 任务 | 优先级 | 说明 |
|------|--------|------|
| XSOAR 配色体系切换 | 中 | 批量替换 Tailwind 色值为 XSOAR 冷调蓝灰 (`#111625` / `#181F32` / `#20293F` 等) |
| Design Tokens 注入 | 中 | 在 `globals.css` 添加语义色变量 (`--color-primary: #0066FF`) |
| 字体体系升级 | 低 | 增加 JetBrains Mono 等宽字体 |
| 极细滚动条 | 低 | 4px → XSOAR 风格 |

### 🔜 待开发 (Phase 4 — 后续模块)

| 模块 | 二级菜单数 | 说明 |
|------|-----------|------|
| 模块2: 网络安全自动运维 | 34 | 设备/策略/基线/日志/账号/备份/权限/加固/工单/诊断/审核 |
| 模块3: 网络安全自动运营 | 16 | 监测/分析/研判/取证/联动/报告 |
| 模块4: 网络安全标准场景自动化 | 10 | 资产发现/基线管理/漏洞/补丁/合规/渗透 |
| 模块5: 网络安全人机协同工作台 | 9 | 分析/知识/大屏/仪表盘/工作台/回溯/报告 |
| 模块6: 运维配置中心 | 13 | 同步/权限/授权/参数/字典/备份/日志 |
| **合计** | **82 个二级菜单页面** | |

---

## 四、设计体系

### 当前配色 (Tailwind Slate)

```
背景:       #0f172a (slate-950)
面板:       #1e293b (slate-800)
卡片:       #0f172a → 边框 #334155
主色:       #3b82f6 (blue-500)
成功/失败:   #22c55e / #ef4444
字体:       Inter
```

### 目标配色 (XSOAR 冷调蓝灰)

```
背景:       #111625
表面/面板:   #181F32
卡片:       #20293F
边框:       #2A354D
主色:       #0066FF
AI 专用色:   #6366F1
成功:       #00C853
警告:       #FF9100
危险:       #FF3B30
主标题:     #F3F4F6
次要文字:   #9CA3AF
禁用文字:   #6B7280
字体:       Inter + JetBrains Mono (代码)
```

升级指南见 `XSOAR_UPGRADE_GUIDE.md`

---

## 五、架构决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 路由方式 | 统一 PageRouter (非 file-based) | Excel 菜单庞大且多级，需动态路由 |
| 状态管理 | React Context | 规模适中，无需 Redux/Zustand |
| 样式方案 | Tailwind CSS v4 | 团队熟悉，暗色主题支持好 |
| 页面生成 | Trae AI 批量生成 | 替代手动写 57 个页面模板 |
| 三级菜单 | 递归渲染 + 缩进层级 | 清晰展示多级嵌套 |
| 设计 Token | CSS 变量覆盖 | 后期一键换肤，不重新生成组件 |

---

## 六、构建验证

```bash
cd secure-ops-platform
npm run build     # 当前通过 ✅
```

---

## 七、文件清单汇总

| 类别 | 数量 | 说明 |
|------|------|------|
| 总 `.tsx`/`.ts` 文件 | 73 | 含页面 + 组件 + 配置 |
| 模块1 页面 | 57 | Trae AI 生成 |
| 页面目录组件 | 6 | Sidebar / MenuItem / PageContent / etc. |
| 上下文/数据/类型 | 4 | SystemContext / menuData / types / PageRouter |
| 配置文件 | 3 | globals.css / layout.tsx / page.tsx |
| 文档 | 4 | README / CLAUDE / AGENTS / TRAE_PROMPT / XSOAR_GUIDE |
