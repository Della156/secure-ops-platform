> **📌 项目实际状态（截至 2026-06-05）**
>
> 本文档的"页面生成规范"仍然有效（用于未来扩展），但项目本身已**全部完成**：
>
> | 指标 | 实际值 |
> |------|--------|
> | 模块完成度 | **6/6 模块 100% 完成** ✅ |
> | 业务页面 | 610 个 pageRegistry entry 100% 真实实现（无 GenericStub 占位） |
> | 菜单覆盖 | 705 菜单（6 一级 + 96 二级 + 603 三级） |
> | 代码规模 | 790 `.tsx` / 157K 行 |
> | 后 MVP 优化 | 4 阶段 15/15 子任务 100% 完成 |
> | Build | ✅ Pass（97.7 KB shared chunk） |
> | 远程仓库 | `https://github.com/Della156/secure-ops-platform.git` |
> | 最新 commit | `8d25f98` fix(search): GlobalSearch 1/2 级菜单点击跳到 firstChildId 3 级子菜单 |
>
> 详细规划见根目录 `CODING_PLAN.md`。

---

# 网络安全智能化运维平台 — Trae AI 设计规范提示词

> **本文件是 Trae AI 生成本项目页面时必须遵守的规范**。
> 适用于 `src/components/Pages/module*/**` 下所有页面组件的批量生成。
> 已完成的 5+ 模块（module1 ~ 50+ 深度页面）可作为风格参考。

---

## 🚨 最高优先级：禁止 shadcn 风格 API

**本项目使用项目自定义组件（data-driven / options-based），**不**使用 shadcn 风格（children 嵌套 / sub-components）。**

### ❌ 禁止（shadcn 风格）

```tsx
// ❌ 错误：Table 用 children 嵌套
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>列名</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// ❌ 错误：Select 用 children + onValueChange
<Select value={x} onValueChange={setX}>
  <SelectTrigger>
    <SelectValue placeholder="..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
  </SelectContent>
</Select>

// ❌ 错误：Dialog 用 asChild
<Dialog>
  <DialogTrigger asChild>
    <Button>查看</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>...</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>

// ❌ 错误：CardContent / Label
<Card>
  <CardContent>...</CardContent>
</Card>
<Label>...</Label>
```

### ✅ 正确（项目自定义风格）

```tsx
// ✅ Table：data-driven API（columns + data）
<Table
  columns={[
    { key: 'id', title: 'ID', width: '120px' },
    { key: 'name', title: '名称' },
    { key: 'status', title: '状态', render: (item) => <StatusBadge status={item.status} /> },
  ]}
  data={filteredData}
  rowKey="id"
  loading={loading}
  emptyText="暂无数据"
/>

// ✅ Select：options-based API
<Select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  options={[
    { value: 'all', label: '全部' },
    { value: 'running', label: '运行中' },
    { value: 'failed', label: '失败' },
  ]}
/>

// ✅ Modal：open + onClose（替代 Dialog）
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>查看</Button>
<Modal open={open} onClose={() => setOpen(false)} title="详情" width="max-w-2xl">
  <div>...</div>
</Modal>

// ✅ Card：直接放内容（Card 自带 padding）
<Card>...</Card>
<Card padding="none">  {/* 表格场景用 none */}
  <Table columns={...} data={...} />
</Card>
```

---

## 1. 技术栈

| 项目 | 版本/库 |
|------|---------|
| 框架 | Next.js 16.2.6 (App Router) |
| 语言 | TypeScript（严格模式，**`ignoreBuildErrors: true` 兜底**）|
| 样式 | Tailwind CSS v4（**不引新图表库**）|
| 图标 | lucide-react（**不引新图标库**）|
| 图表 | recharts（LineChart / BarChart / PieChart / RadarChart / AreaChart）|
| 自定义图表 | SVG 手绘（攻击路径图、横向渗透图等复杂可视化）|

---

## 2. 文件结构

```
src/components/Pages/
├── module1/             # 网络安全自动任务配置
├── module2/             # 网络安全自动运维
├── module3/             # 网络安全自动运营
├── module4/             # 网络安全标准场景自动化
├── module5/             # 网络安全人机协同工作台
└── module6/             # 运维配置中心
```

**每个二级目录的组织方式：**
```
module3/traceAnalysis/
  ├── TraceAnalysisView.tsx           # 3-7-1 概览/仪表盘
  ├── AttackBehaviorAnalysis.tsx      # 3-7-2 攻击行为分析
  ├── TraceToolAutoInvocation.tsx     # 3-7-3 工具调用
  └── TraceResultVisualization.tsx    # 3-7-4 可视化
```

**命名规范：**
- 文件名 = 组件名 = `PascalCase.tsx`
- 组件名尽量还原菜单语义，不要用 `Page1.tsx` / `Component.tsx`

---

## 3. 全局设计令牌

| 用途 | Tailwind 类 | 实际值 |
|------|-------------|--------|
| 页面底层背景 | `bg-[#111625]` | `#111625` |
| 卡片背景 | `bg-[#20293F]` | `#20293F` |
| 二级容器背景 | `bg-[#181F32]` | `#181F32` |
| 边框 | `border-[#2A354D]` | `#2A354D` |
| 主文字 | `text-white` / `text-slate-50` | `#F3F4F6` |
| 次文字 | `text-slate-400` | `#9CA3AF` |
| 弱文字 | `text-slate-500` | `#6B7280` |
| 蓝色（主色） | `bg-[#0066FF]` / `text-blue-400` | `#0066FF` |
| 绿色（成功） | `text-green-400` | `#22C55E` |
| 红色（危险） | `text-red-400` | `#EF4444` |
| 橙色（告警） | `text-orange-400` / `text-[#FF6D00]` | `#FF6D00` |
| 黄色（警告） | `text-yellow-400` | `#EAB308` |
| 紫色（特殊） | `text-purple-400` | `#A855F7` |
| 青色（信息） | `text-cyan-300` | `#06B6D4` |

---

## 4. 组件库 API（必读）

### 4.1 Card

```tsx
<Card>...</Card>                  {/* 默认 padding=md */}
<Card padding="none">...</Card>   {/* 表格场景 */}
<Card padding="sm">...</Card>     {/* 紧凑 */}
<Card hover onClick={...}>...</Card>  {/* 可点击 */}
```

### 4.2 Button

```tsx
<Button variant="primary">主要按钮</Button>     // 蓝
<Button variant="secondary">次要按钮</Button>   // 灰
<Button variant="ghost">幽灵按钮</Button>        // 透明
<Button variant="danger">危险按钮</Button>       // 红
<Button variant="success">成功按钮</Button>       // 绿
<Button size="sm">小</Button>                    // sm/md/lg
<Button loading>加载中</Button>
<Button icon={<Plus />}>带图标</Button>
```

### 4.3 Input

```tsx
<Input label="用户名" placeholder="..." />
<Input prefixIcon={<Search />} />
<Input error="必填" />
```

### 4.4 Select

```tsx
<Select
  value={x}
  onChange={(e) => setX(e.target.value)}
  options={[{ value: 'a', label: 'A' }]}
/>
```

### 4.5 Table（data-driven）

```tsx
<Table
  columns={[
    { key: 'id', title: 'ID', width: '120px' },
    { key: 'name', title: '名称' },
    {
      key: 'status',
      title: '状态',
      width: '100px',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ]}
  data={filteredData}
  rowKey="id"
  loading={loading}
  emptyText="暂无数据"
  onRowClick={(item) => setSelected(item)}
/>
```

### 4.6 Modal

```tsx
const [open, setOpen] = useState(false);
<Modal open={open} onClose={() => setOpen(false)} title="标题" width="max-w-2xl" footer={<Button>关闭</Button>}>
  <div>内容</div>
</Modal>
```

### 4.7 StatusBadge（项目自带的常用徽章）

```tsx
<StatusBadge status="running" />   // 运行中
<StatusBadge status="completed" /> // 已完成
<StatusBadge status="failed" />    // 失败
<StatusBadge status="pending" />   // 待执行
<StatusBadge status="warning" />   // 异常
<StatusBadge status="success" />   // 成功
<StatusBadge status="error" />     // 错误
<StatusBadge status="info" />      // 信息
```

### 4.8 Badge（多变体标签）

```tsx
<Badge variant="success">绿色</Badge>
<Badge variant="warning">黄色</Badge>
<Badge variant="destructive">红色</Badge>
<Badge variant="info">青色</Badge>
<Badge variant="secondary">灰色</Badge>
<Badge variant="default">蓝色</Badge>
<Badge variant="outline">边框</Badge>
```

**如果项目没有合适的变体，用内联 span：**
```tsx
<span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border bg-orange-500/20 text-orange-400 border-orange-500/40">
  自定义
</span>
```

### 4.9 Empty / Loading / Toast

```tsx
<Empty description="暂无数据" />
<Loading />
<Toast variant="success">操作成功</Toast>
```

---

## 5. 状态/类型配色规范

| 状态/类型 | 背景 | 文字 | 边框 | Tailwind |
|----------|------|------|------|----------|
| 成功 | bg-green-500/20 | text-green-400 | border-green-500/40 |
| 失败 | bg-red-500/20 | text-red-400 | border-red-500/40 |
| 运行中 | bg-blue-500/20 | text-blue-400 | border-blue-500/40 |
| 警告 | bg-yellow-500/20 | text-yellow-400 | border-yellow-500/40 |
| 异常 | bg-orange-500/20 | text-orange-400 | border-orange-500/40 |
| 待执行 | bg-purple-500/20 | text-purple-400 | border-purple-500/40 |
| 信息 | bg-cyan-500/20 | text-cyan-400 | border-cyan-500/40 |
| 严重 | bg-red-500/20 | text-red-400 | border-red-500/40 |

---

## 6. 必遵循的代码风格

### 6.1 Import 顺序

```tsx
'use client';

import { useState, useEffect, useMemo } from 'react';        // 1. React
import { Shield, AlertCircle, Play } from 'lucide-react';    // 2. 图标
import { Card } from '@/components/ui/Card';                  // 3. 项目组件
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/Common/StatusBadge'; // 4. 通用组件
```

### 6.2 路径大小写（重要）

- **必须大写**：`@/components/ui/Card` / `@/components/ui/Button` / `@/components/ui/Table`
- 项目实际只有大写文件，**macOS 大小写不敏感**会让小写路径"看起来"也能跑，但**部署到 Linux 会失败**
- 绝不使用：`@/components/ui/card`（错误，已废弃）

### 6.3 文件结尾

```tsx
export function ComponentName() { ... }    // 必须有具名导出

export default ComponentName;              // 也提供默认导出
```

### 6.4 TypeScript 严格性

- 不用 `@/hooks/useAsyncData` 等**项目未实现的 hooks**
- 只用 `useState` / `useEffect` / `useMemo` / `useCallback` / `useRef`
- 类型定义用 interface，不用 type（除非联合类型）

---

## 7. 页面结构模板（**核心**）

### 7.1 概览/仪表盘页（最常见）

```tsx
'use client';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { LineChart, Line, ... } from 'recharts';
import { RefreshCw, Download, Filter } from 'lucide-react';

export function PageView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => ({ ... }), []);
  const filtered = useMemo(() => data.filter(...), [data, search, filter]);

  const columns = [...];

  return (
    <div className="p-6 space-y-4">
      {/* 1. 顶部 KPI（4 个 StatBox 横排） */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总任务" value={stats.total} color="#0066FF" icon={<Activity />} />
        ...
      </div>

      {/* 2. 趋势图（独立 Card） */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">趋势</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trendData}>...</LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 3. 标题 + 过滤工具栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><RefreshCw />刷新</Button>
            <Button size="sm"><Download />导出</Button>
          </div>
        </div>
        {/* 过滤区 */}
      </div>

      {/* 4. 主内容：左 2/3 列表 + 右 1/3 详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card padding="none">
            <Table columns={columns} data={filtered} rowKey="id" />
          </Card>
        </div>
        {selected && (
          <Card>...详情面板...</Card>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }) { ... }
```

### 7.2 监控/状态页

```tsx
// 7 个任务监控卡片（每个含进度条 + 操作）
{tasks.map(task => (
  <div key={task.id} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-red-500 (failed)">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-green-400 animate-pulse (running)" />
        <div>
          <p className="text-slate-50 font-medium">{task.name}</p>
          <p className="text-slate-500 text-sm">ID: {task.id} | 运行时长: {task.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={task.status} />
        <Button variant="ghost" size="sm"><Eye /></Button>
        {task.status === 'running' && <Button variant="ghost" size="sm"><Pause /></Button>}
      </div>
    </div>
    <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600" style={{ width: `${task.progress}%` }} />
    </div>
  </div>
))}
```

### 7.3 报告页（左右分栏）

```tsx
<Card padding="none">
  <div className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 左：报告列表（可点击选中） */}
      <div>
        {reports.map(r => (
          <div onClick={() => setSelected(r)}
               className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer ${selected.id === r.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'}`}>
            ...
          </div>
        ))}
      </div>
      {/* 右：报告预览 */}
      <div className="md:col-span-2">
        <div className="bg-slate-800/50 rounded-lg p-6">
          {/* 报告内容：KPI + 图表 + 文字结论 */}
        </div>
      </div>
    </div>
  </div>
</Card>
```

### 7.4 详情弹窗（Modal）

```tsx
const [selected, setSelected] = useState<... | null>(null);
const columns = [
  { ..., render: (item) => <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>详情</Button> }
];

<Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} width="max-w-2xl">
  {selected && (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-slate-400 text-sm">字段</p>
          <p className="text-slate-50 mt-1">{selected.field}</p>
        </div>
        ...
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setSelected(null)}>关闭</Button>
      </div>
    </div>
  )}
</Modal>
```

### 7.5 历史查询/列表页

```tsx
// 顶部过滤：搜索 + 状态 + 日期 + 操作
<div className="flex flex-wrap items-center gap-3">
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
    <Input placeholder="搜索..." value={search} onChange={...} className="pl-10" />
  </div>
  <div className="w-32"><Select value={...} onChange={...} options={...} /></div>
  <Button variant="secondary" size="sm"><Calendar />选择日期</Button>
  <Button variant="secondary" size="sm"><Filter />筛选</Button>
</div>

// 主体：Table + 分页
<Card padding="none">
  <Table columns={columns} data={filtered} rowKey="id" />
</Card>
<div className="flex items-center justify-center gap-2">
  <Button variant="secondary" size="sm" disabled>上一页</Button>
  <Button variant="primary" size="sm">1</Button>
  ...
</div>
```

### 7.6 审计页（密集表格 + 多重过滤）

```tsx
// 顶部 4 KPI（总数/成功/失败/高风险）
// 趋势图（24h 或 7 天）
// 操作类型分布（横向条形图）
// 表格 + 4 个过滤（搜索/操作/结果/风险）
// 右侧详情面板（点击行时显示）
```

---

## 8. 关键模式片段（直接复制使用）

### 8.1 StatBox（KPI 卡片）

```tsx
function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
```

### 8.2 进度条

```tsx
<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
  <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
</div>
```

### 8.3 状态徽章（无 StatusBadge 时的内联方案）

```tsx
const statusStyle = {
  running: 'bg-green-500/20 text-green-400 border-green-500/40',
  failed: 'bg-red-500/20 text-red-400 border-red-500/40',
  ...
};
<span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${statusStyle[status]}`}>
  {statusText[status]}
</span>
```

### 8.4 列表项（带 hover 选中）

```tsx
<div onClick={() => setSelected(item)}
     className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer ${selected?.id === item.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'}`}>
  ...
</div>
```

### 8.5 标签组（多标签并列）

```tsx
<div className="flex flex-wrap gap-1">
  {tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{t}</span>)}
</div>
```

### 8.6 详情卡片（用于 Modal 内）

```tsx
<div className="bg-slate-800/50 rounded-lg p-3">
  <p className="text-slate-400 text-sm">标签</p>
  <p className="text-slate-50 mt-1">{value}</p>
</div>
```

### 8.7 6 维评分雷达图

```tsx
<ResponsiveContainer width="100%" height={200}>
  <RadarChart data={radarData}>
    <PolarGrid stroke="#2A354D" />
    <PolarAngleAxis dataKey="dim" tick={{ fill: '#94A3B8', fontSize: 10 }} />
    <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
    <Radar dataKey="value" stroke="#9333EA" fill="#9333EA" fillOpacity={0.3} />
  </RadarChart>
</ResponsiveContainer>
```

### 8.8 SVG 手绘图（攻击路径/网络拓扑）

```tsx
// 用 <svg viewBox="0 0 800 500"> + 节点 <circle> + 边 <line path> + 动画 <animate>
// 详细示例参考 module3/traceAnalysis/TraceResultVisualization.tsx
```

---

## 9. 禁止事项（红线）

❌ 引入新的 UI 库（如 antd / material-ui / shadcn 安装）
❌ 引入新的图表库（如 echarts / chart.js）
❌ 使用 shadcn 风格的 `<Table><TableHeader>...` 嵌套
❌ 引入不存在的 hooks（`@/hooks/useAsyncData` 等）
❌ 引入不存在的工具（`@/lib/utils` 等）
❌ 写服务端代码（这是纯前端项目，App Router 仅作静态导出壳）
❌ 修改 `menuData.ts` / `pageRegistry.tsx`（菜单和路由已配好）
❌ 写空 `// TODO` 后直接提交
❌ 改全局文件（`globals.css` / `next.config.mjs`）
❌ 使用 `'use client'` 之外的渲染模式

---

## 10. 业务页面必须有的元素清单

每个页面**至少**包含：

- [ ] 页面标题（`<h1>`） + 描述（`<p>`）
- [ ] 顶部操作按钮组（导出/刷新/新建/筛选）
- [ ] 过滤/搜索区（如适用）
- [ ] 主体内容（KPI / 表格 / 图表 / 详情）
- [ ] 分页控件（5 个按钮：上一页 / 1 / 2 / 3 / 下一页）
- [ ] 状态徽章（统一使用 StatusBadge 或内联样式）
- [ ] Modal（如有详情查看）
- [ ] 响应式（`grid-cols-1 md:grid-cols-...`）

---

## 11. 每个页面文件模板（完整骨架）

```tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Calendar, Eye, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Entity {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  // ... 其他字段
}

const mockData: Entity[] = [
  // 6-10 条样例数据
];

const trendData = [
  { time: '00:00', value: 10 },
  { time: '04:00', value: 15 },
  // ...
];

export function YourPageName() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Entity | null>(null);

  const stats = useMemo(() => ({
    total: mockData.length,
    success: mockData.filter(d => d.status === 'completed').length,
    failed: mockData.filter(d => d.status === 'failed').length,
    pending: mockData.filter(d => d.status === 'pending').length,
  }), []);

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.name.includes(search)) return false;
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: 'ID', width: '120px' },
    { key: 'name', title: '名称' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: Entity) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (item: Entity) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
          <Eye className="w-3.5 h-3.5 mr-1" />详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总数" value={stats.total} color="#0066FF" icon={<FileText />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle />} />
        <StatBox label="待执行" value={stats.pending} color="#EAB308" icon={<Clock />} />
      </div>

      {/* 趋势图 */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">趋势（24h）</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Line type="monotone" dataKey="value" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 标题 + 过滤 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">页面标题</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={[
              { value: 'all', label: '全部' },
              { value: 'running', label: '运行中' },
              { value: 'completed', label: '已完成' },
              { value: 'failed', label: '失败' },
            ]} />
          </div>
          <Button variant="secondary" size="sm"><RefreshCw />刷新</Button>
          <Button size="sm"><Download />导出</Button>
        </div>
      </div>

      {/* 主表格 */}
      <Card padding="none">
        <Table columns={columns} data={filtered} rowKey="id" />
      </Card>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">3</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      {/* 详情 Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || '详情'} width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">ID</p>
                <p className="text-slate-50 font-mono mt-1">{selected.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default YourPageName;
```

---

## 12. 完成检查清单

生成完页面后，**自检**以下项：

- [ ] 顶部有 `'use client';` 指令
- [ ] 使用项目自定义组件（Card/Button/Input/Select/Table/Modal/StatusBadge/Badge）
- [ ] **没有**使用 shadcn 风格（TableHeader/TableBody/TableCell 等）
- [ ] **没有**引用不存在的 hooks（`@/hooks/...`）
- [ ] **没有**引入新 UI 库 / 图表库
- [ ] 路径使用大写（`@/components/ui/Card` 而非 `card`）
- [ ] 至少包含 6-10 条样例 mock data
- [ ] 至少有一个交互（搜索/过滤/点击行/Modal）
- [ ] 状态徽章配色符合规范
- [ ] 整体风格与 module1-5 已完成页面一致（深色、紧凑、信息密度高）
- [ ] 文件大小在 **10-25 KB** 之间（深度设计页面）

---

**参考实现：** `src/components/Pages/module1/taskMonitor/TaskRunMonitor.tsx` 和 `src/components/Pages/module3/lateralMovement/LateralMovementView.tsx` 是最规范的两个深度设计页面。
