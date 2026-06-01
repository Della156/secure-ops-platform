# 模块2：网络安全自动运维 — Trae 设计提示词

## 任务概述

基于现有系统 `secure-ops-platform`，设计与实现**模块2：网络安全自动运维**的全部页面组件。该模块共包含 **34 个二级目录分组、215 个三级页面**。

## 项目上下文

- **框架**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **菜单配置**: `src/data/menuData.ts` — menu-2 已配置完整三级菜单结构
- **页面注册**: `src/data/pageRegistry.tsx` — 按 `menu-2-X-Y` ID 映射组件
- **页面路由**: `src/components/PageRouter.tsx` — 自动根据 activeMenu 加载组件
- **页面外壳**: `src/components/PageShell.tsx` — 统一包裹面包屑、标题、内边距 `p-4`
- **页面目录**: `src/components/Pages/module2/` — 在此目录下创建组件
- **设计参考**: 模块1的已有页面（`src/components/Pages/module1/`）为设计参照

## 页面设计规范

### 1. 组件结构规范

```tsx
'use client';

export function YourPageComponent() {
  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">页面标题</h2>
        <p className="text-sm text-gray-400 mt-1">功能描述</p>
      </div>

      {/* 筛选条件栏 */}
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        {/* 搜索、筛选、按钮等 */}
      </div>

      {/* 统计卡片 / 图表区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 指标卡片 */}
      </div>

      {/* 数据表格 / 列表 */}
      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        {/* 表格内容 */}
      </div>
    </div>
  );
}
```

### 2. 无需包额外 padding

PageShell 已统一定义 `p-4`，页面组件**根部不要写** `className="p-8"`，直接 `<div>` 即可。

### 3. 配色方案

| 用途 | 色值 |
|------|------|
| 页面背景 | `#111827` (gray-900) |
| 卡片/面板背景 | `#1E2736`  |
| 卡片边框 | `#2A354D` |
| 标题文字 | `text-white` |
| 次要文字 | `text-gray-400` |
| 强调文字 | `text-[#60A5FA]` (蓝色) |
| 成功状态 | `text-green-400` |
| 警告状态 | `text-yellow-400` |
| 错误状态 | `text-red-400` |
| 主要按钮 | `bg-blue-600 hover:bg-blue-700 text-white` |
| 次要按钮 | `bg-[#2A354D] hover:bg-[#3A456D] text-white` |

### 4. 通用 UI 模式

**数据表格**: 使用 HTML `<table>` + Tailwind，统一风格：
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-[#2A354D]">
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">列名</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
        <td className="px-4 py-3 text-sm text-white">数据</td>
      </tr>
    </tbody>
  </table>
</div>
```

**状态标签**:
```tsx
<span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">运行中</span>
<span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待处理</span>
<span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">异常</span>
```

**空状态/加载状态**:
- 无数据时：`<p className="text-gray-500 text-center py-8">暂无数据</p>`
- 加载中：`<div className="animate-pulse bg-[#2A354D] rounded h-8 w-full"></div>`

**模态框**:
```tsx
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#1E2736] border border-[#2A354D] rounded-xl p-6 w-[480px] max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">标题</h3>
        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>
      {/* 内容 */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-4 py-2 text-sm text-gray-400 hover:text-white" onClick={() => setShowModal(false)}>取消</button>
        <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">确认</button>
      </div>
    </div>
  </div>
)}
```

**图表占位**（后续集成 echarts）:
```tsx
<div className="h-64 bg-[#1E2736] border border-[#2A354D] rounded-lg flex items-center justify-center text-gray-500">
  图表区域（待接入数据）
</div>
```

### 5. 页面分组与命名规范

在 `src/components/Pages/module2/` 下，按功能分组创建目录：

| 分组 | 目录名 | 包含页面 |
|------|--------|---------|
| 1. 设备运行状态检查 | `deviceStatus/` | 8个页面 |
| 2. 安全策略检查 | `securityPolicy/` | 7个页面 |
| 3. 特征库版本检查 | `signatureVersion/` | 6个页面 |
| 4. 业务功能检查 | `businessCheck/` | 5个页面 |
| 5. 操作系统基线检查 | `osBaseline/` | 9个页面 |
| 6. 中间件基线检查 | `middlewareBaseline/` | 9个页面 |
| 7. 数据库基线检查 | `dbBaseline/` | 8个页面 |
| 8. 安全设备基线检查 | `deviceBaseline/` | 6个页面 |
| 9. 日志处理 | `logProcessing/` | 7个页面 |
| 10. 系统数据处理 | `dataProcessing/` | 4个页面 |
| 11. 账号处理 | `accountProcessing/` | 5个页面 |
| 12. 备份任务 | `backupTask/` | 6个页面 |
| 13. 恢复任务 | `restoreTask/` | 7个页面 |
| 14. 备份恢复演练 | `backupDrill/` | 8个页面 |
| 15. 系统启停 | `systemStartStop/` | 6个页面 |
| 16. 系统配置调优 | `systemTuning/` | 6个页面 |
| 17. 权限分配任务 | `permAssign/` | 5个页面 |
| 18. 权限回收任务 | `permRevoke/` | 6个页面 |
| 19. 权限审计 | `permAudit/` | 8个页面 |
| 20. 安全基线加固 | `baselineHardening/` | 7个页面 |
| 21. 安全漏洞加固 | `vulnHardening/` | 9个页面 |
| 22. 安全客服 | `securityHelpdesk/` | 8个页面 |
| 23. 准入工单 | `accessWorkOrder/` | 8个页面 |
| 24. 防火墙策略工单 | `firewallWorkOrder/` | 11个页面 |
| 25. PKI工单 | `pkiWorkOrder/` | 7个页面 |
| 26. 网络故障诊断 | `networkDiag/` | 7个页面 |
| 27. 系统故障诊断 | `systemDiag/` | 6个页面 |
| 28. 性能诊断 | `perfDiag/` | 7个页面 |
| 29. 安全阻断诊断 | `blockDiag/` | 6个页面 |
| 30. 综合故障诊断 | `comprehensiveDiag/` | 6个页面 |
| 31. 作业审核 | `jobAudit/` | 8个页面 |
| 32. 作业方案审核 | `jobPlanAudit/` | 7个页面 |
| 33. 作业问题检查 | `jobIssueCheck/` | 8个页面 |
| 34. 作业综合辅助 | `jobAssistant/` | 7个页面 |

### 6. 文件名与导出规范

每个文件命名规则：`功能英文名.tsx`（首字母大写驼峰），导出具名组件。

```
例：
设备运行状态检查视图 → DeviceStatusView.tsx → export function DeviceStatusView()
运行状态实时监测    → RealtimeMonitor.tsx   → export function RealtimeMonitor()
```

### 7. pageRegistry 注册示例

在 `src/data/pageRegistry.tsx` 中添加：

```tsx
// 第1组：设备运行状态检查视图
const DeviceStatusView = dynamic(() => import(
  '@/components/Pages/module2/deviceStatus/DeviceStatusView'
).then(m => ({ default: m.DeviceStatusView })));

// 注册表
'menu-2-1-1': DeviceStatusView,
'menu-2-1-2': RealtimeMonitor,
// ...
```

### 8. 执行步骤建议

1. **Phase 1** — 核心检查视图（第1-9组, 共63页）：设备运行状态、安全策略、特征库、业务功能、各类基线检查
2. **Phase 2** — 数据处理视图（第10-14组, 共30页）：日志、系统数据、账号、备份、恢复、演练
3. **Phase 3** — 运维操作视图（第15-18组, 共23页）：启停、调优、权限分配/回收
4. **Phase 4** — 安全加固视图（第19-25组, 共58页）：审计、基线加固、漏洞加固、客服、各类工单
5. **Phase 5** — 诊断视图（第26-30组, 共32页）：各类故障诊断
6. **Phase 6** — 作业视图（第31-34组, 共30页）：审核、方案审核、问题检查、辅助

### 9. 通用布局模板

每个分组内的页面共享相似结构，典型布局：

```
┌─ 页面标题 ─────────────────────────────────────┐
│ 功能名称 + 简短描述                              │
├─ 筛选条件栏 ────────────────────────────────────┤
│ [关键字搜索] [状态选择] [时间范围] [查询] [新增] │
├─ 统计卡片（如有） ──────────────────────────────┤
│ 总数: XX    运行中: XX    异常: XX    成功率: XX% │
├─ 数据表格 ──────────────────────────────────────┤
│ 序号 │ 名称 │ 状态 │ 创建时间 │ 操作             │
│ ─────────────────────────────────────────────── │
│  1  │ XXX  │ 运行中 │ 2026-05-29 │ [详情] [编辑] │
│  2  │ XXX  │ 异常  │ 2026-05-28 │ [详情] [编辑] │
└─────────────────────────────────────────────────┘
```
