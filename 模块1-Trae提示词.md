# 📋 Trae 提示词：模块1「网络安全自动任务配置」深度实现

## 项目概述

```
项目名：secure-ops-platform
框架：Next.js 14 (App Router) + TypeScript + Tailwind CSS
UI库：lucide-react（图标），后期可加 recharts（图表）
项目路径：/Users/koreyoshi/Claude Code/网络安全智能化运维新系统原型/secure-ops-platform
菜单配置：src/data/menuData.ts（已配好53个三级菜单）
页面注册：src/data/pageRegistry.tsx（已注册全部57个页面）
数据流：全部页面目前使用内联mock数据，需保持mock模式（后端未对接）
```

**约束原则**：
1. 保持现有UI风格（深色主题：背景 `#111625/#181F32/#20293F`，边框 `#2A354D`，主色 `#0066FF`，文字 `#F3F4F6/#D1D5DB/#9CA3AF`）
2. 所有页面保持 mock 数据源模式，但将 mock 数据迁移到 `src/data/module1/` 下独立文件
3. **不破坏已有页面注册**，直接在现有文件上增强

---

## 第一阶段：通用组件抽取（节省40%代码量）

### 任务 1.1：创建 ResourcePageFactory（解决20个资源页面的模板复制）

在 `src/components/Common/` 下创建以下组件：

```typescript
// src/components/Common/ResourceList.tsx
// 通用资源列表组件，配置驱动
// 参数：resourceType, columns, fetchData, actions
// 内置：搜索/筛选/分页/排序/批量操作/详情抽屉

// src/components/Common/ResourceConnectTest.tsx
// 通用连接测试组件
// 参数：resourceType, testEndpoint, protocols
// 内置：协议选择/地址输入/测试按钮/实时日志/历史记录

// src/components/Common/ResourceAuthManager.tsx
// 通用授权管理组件
// 参数：resourceType, authMethods, permissions
// 内置：授权列表/权限切换/有效期设置/批量授权

// src/components/Common/ResourceServiceView.tsx
// 通用服务/指令/API 视图组件
// 参数：resourceType, services
// 内置：分类筛选+搜索+可展开卡片+代码复制+参数表格

// src/components/Common/ResourceAccessLog.tsx
// 通用访问日志组件
// 参数：resourceType, logFields
// 内置：时间范围选择/操作类型筛选/结果筛选/导出/详情
```

**替换清单**（20个页面→5个通用组件）：

| 原页面 | 替换为 |
|--------|--------|
| `resourceManagement/device/DeviceList.tsx` | `<ResourceList resourceType="device" />` |
| `resourceManagement/host/HostList.tsx` | `<ResourceList resourceType="host" />` |
| `resourceManagement/system/SystemList.tsx` | `<ResourceList resourceType="system" />` |
| `resourceManagement/endpoint/EndpointList.tsx` | `<ResourceList resourceType="endpoint" />` |
| 同理 Device/System/Host/Endpoint 的 ConnectTest/Auth/Service/AccessLog | 对应通用组件 |

**mock数据文件**：
```typescript
// src/data/module1/resourceMock.ts
// 导出各资源类型的列表/日志/服务mock数据
export const deviceMock = { list: [...], logs: [...], services: [...] };
export const hostMock = { ... };
export const systemMock = { ... };
export const endpointMock = { ... };
```

### 任务 1.2：创建 TaskMonitorPanel（解决6个任务监控页的重复）

```typescript
// src/components/Common/TaskMonitorPanel.tsx
// 通用任务监控面板
// 参数：tasks, columns, statusConfig, onAction
// 内置：状态分布统计+列表+详情抽屉+批量操作+筛选
```

**覆盖页面**：
- TaskRunStatusList (334行) → 替换为配置式
- TaskRunStatistics (310行) → 替换为配置式
- TaskExceptionAnalysis (446行) → 增强
- TaskAlertManagement (532行) → 增强

---

## 第二阶段：Top 5 浅层页面深度实现

### 任务 2.1：menu-1-3-3 任务运行监控（288行 → 目标600行）

**文件**：`src/components/Pages/module1/taskMonitor/TaskRunMonitor.tsx`

**需要增加**：
1. **DAG执行拓扑图**（左侧）：显示任务节点的依赖关系图，用 SVG 绘制节点+连线，区分成功/失败/运行/等待状态
2. **节点详情面板**（点击节点）：显示该节点的输入参数/输出结果/执行耗时/重试次数
3. **目标主机管理**（批量控制）：全选/反选/批量重试/暂停/跳过
4. **实时日志增强**：日志级别筛选+搜索+高亮+导出
5. **资源趋势图**：用 recharts 柱状图展示 CPU/内存的时序变化

**mock 数据增强**：
- 节点数据从 10 个增加到 20+（含复杂依赖关系）
- 主机从 12 台增加到 50 台（含不同进度和状态）
- 日志从 20 条基础样本扩展到 5 种场景样本

### 任务 2.2：menu-1-3-1 任务运行状态列表（334行 → 目标500行）

**文件**：`src/components/Pages/module1/taskMonitor/TaskRunStatusList.tsx`

**需要增加**：
1. **多维度统计条**（顶部）：总任务/运行中/成功/失败/超时 的计数卡片+趋势箭头
2. **高级筛选栏**：状态+类型+优先级+时间范围+搜索+保存筛选方案
3. **详情抽屉**（点击行）：任务基本信息+执行阶段时间轴+节点状态列表+日志预览
4. **批量操作**：批量暂停/恢复/重试/终止（复选框列+操作栏）
5. **自定义列**：列显示切换+列排序

### 任务 2.3：menu-1-8-1 任务执行进度全局视图（272行 → 目标500行）

**文件**：`src/components/Pages/module1/executionMonitor/GlobalProgressView.tsx`

**需要增加**：
1. **Gantt 图视图**（新标签页）：按任务显示执行时间线，依赖关系连线
2. **看板视图增强**：拖拽改变状态（react-dnd），卡片显示进度条+负责人+标签
3. **执行仪表盘**：顶部卡片区显示 成功率98%/平均耗时45s/失败任务3/超时任务1
4. **任务操作菜单**（每行）：暂停/终止/重试/查看详情/查看日志
5. **执行历史对比**：与上次执行的耗时差异标记

### 任务 2.4：menu-1-8-4 任务执行监控与审计（269行 → 目标450行）

**文件**：`src/components/Pages/module1/executionMonitor/ExecutionAudit.tsx`

**需要增加**：
1. **审计规则配置**（新Tab）：定义哪些操作需要审计、审计级别、审批流程
2. **执行记录增强**：点击显示执行详情抽屉（参数/结果/日志/耗时）
3. **操作日志增强**：详情弹窗显示操作前后JSON对比+关联任务
4. **合规审计视图**：标记不合规操作+审计建议
5. **导出功能**：CSV/PDF 导出，带时间范围选择+列选择

### 任务 2.5：menu-1-8-3 任务运行控制（363行 → 目标500行）

**文件**：`src/components/Pages/module1/executionMonitor/RunControl.tsx`

**需要增加**：
1. **策略控制**（高级）：任务依赖策略（并行/串行/条件等待）、超时策略、重试策略
2. **安全控制**：执行审批流程、操作人验证、变更记录
3. **批量控制**：按标签/状态/类型批量启停
4. **执行计划**：定时执行/周期执行/事件触发 的可视化配置
5. **控制日志**：所有控制操作的审计轨迹

---

## 第三阶段：6-12 名页面增强

### 任务 3.1：menu-1-7-2 任务优先级管理（360行 → 目标500行）

**文件**：`src/components/Pages/module1/scheduler/PriorityManagement.tsx`

**增加**：
1. 拖拽排序（react-dnd）调整优先级顺序
2. 优先级权重配置（数值滑动条）
3. 优先级冲突检测（高优先级任务太多时的警告）
4. 优先级队列可视化（等待队列+运行队列的实时视图）
5. 优先级策略模板（FIFO/最短作业优先/高优先级优先）

### 任务 3.2：menu-1-5-1 流程编排管理（372行 → 目标600行）

**文件**：`src/components/Pages/module1/flowEditor/FlowOrchestration.tsx`

**增加**：
1. **可视化画布**（用 @xyflow/react/reactflow）：拖拽节点+连线+缩放
2. **节点属性面板**：点击节点显示属性编辑面板
3. **流程验证**：循环检测+断点检测+未连接节点提示
4. **版本管理**：保存版本+版本对比+回滚
5. **流程模板**：从已有流程另存为模板

### 任务 3.3：menu-1-6-1 模板创建与保存（352行 → 目标500行）

**文件**：`src/components/Pages/module1/templateManager/TemplateCreateSave.tsx`

**增加**：
1. 模板版本对比（可视化差异）
2. 草稿自动保存+恢复
3. 参数预览（输入参数后预览生成的流程）
4. 模板分类树+标签管理
5. 模板校验（必填参数检查+依赖检查）

### 任务 3.4：menu-1-3-4 任务资源使用率监控（390行 → 目标550行）

**文件**：`src/components/Pages/module1/taskMonitor/TaskResourceMonitor.tsx`

**增加**：
1. 时间序列折线图（CPU/内存/网络/磁盘 过去24小时/7天/30天）
2. 资源阈值配置+超阈值告警（颜色标记+告警列表）
3. 按任务维度的资源消耗排行
4. 资源预测（基于历史数据的趋势预测线）
5. 资源池视图（集群资源总览+各节点资源分布）

---

## 第四阶段：18个中层页面补齐

### 任务 4.1：统一补齐清单（18个页面）

对所有 300-400 行的页面执行以下增强：

1. **数据量增强**：mock 数据从 2-5 条增加到 20-50 条（含边界情况：空状态/错误状态/大文本）
2. **详情抽屉**：点击列表行弹出详情抽屉，显示完整字段+关联信息
3. **统计卡片**：页面顶部增加 3-4 个统计指标卡
4. **筛选增强**：增加多条件联合筛选（文本+下拉+日期范围）
5. **批量操作**：超过 60% 的列表型页面增加复选框+批量操作栏
6. **空状态/错误/加载态**：所有页面覆盖 loading/empty/error 三种状态

**涉及页面**：
```
TaskAccessManagement(315), TaskRunStatistics(310), NodeExecutionLog(351),
TemplateCreateSave(352), PriorityManagement(360), RunControl(363),
FlowOrchestration(372), InterfaceConfig(375), TaskResourceMonitor(390),
TemplateImportInstance(400), TemplateParamConfig(404), 
InterfacePerformance(406), InterfaceConnectTest(409), InterfaceCallLog(410),
ApiCallAnalysis(411), TriggerModeConfig(412), TaskAccessStatus(412),
TaskExceptionAnalysis(446)
```

---

## 🎨 视觉设计规范（保持统一）

### 颜色体系
```
背景层级：#111625(最深) → #181F32(输入框) → #20293F(卡片) → #2A354D(边框)
主色：#0066FF
成功：#00C853
失败：#FF3B30
警告：#FF9100
文字：#F3F4F6(主) / #D1D5DB(次) / #9CA3AF(辅助) / #6B7280(占位)
```

### 组件样式模式
```
输入框：bg-[#181F32] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2
按钮-主：bg-[#0066FF] text-white rounded-lg px-4 py-2
按钮-次：bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg px-4 py-2
卡片：bg-[#20293F] border border-[#2A354D] rounded-xl
表格头：bg-[#181F32]/50 text-[#9CA3AF] uppercase tracking-wider text-xs
状态标签：rounded-full text-xs font-medium border px-2.5 py-1
```

### Lucide 图标使用
```
操作：Search, Filter, Download, RefreshCw, Plus, Edit, Trash2, Eye
状态：CheckCircle2, XCircle, Activity, Clock, AlertCircle
导航：ChevronRight, ChevronDown, ChevronLeft
资源：Server, Monitor, Database, HardDrive, Wifi, Cpu
```

---

## ⚠️ 避免踩坑

1. **不要改动 menuData.ts** — 菜单配置已锁定
2. **不要在 pageRegistry.tsx 中重新注册** — 只替换实际页面文件内容
3. **保持 'use client' 指令** — 所有页面都是客户端组件
4. **mock 数据不要写 API 调用** — 保持前端独立运行
5. **不要删除现有文件** — 直接修改文件内容即可
6. **每个组件导出名保持与注册一致** — 例如 `export function ExecutionAudit` 不要改成 `export default`
7. **不要引入新的 npm 包** — 除非在第二阶段明确指定（如 react-flow, react-dnd, recharts）
