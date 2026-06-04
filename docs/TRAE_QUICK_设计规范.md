# Trae AI 快速提示词（直接复制用）

> **用途**：喂给 Trae AI 让它批量生成本项目页面。
> **位置**：`src/components/Pages/module*/**/*.tsx`
> **完整版规范**：`docs/TRAE_PROMPT_设计规范.md`（推荐先看完整版）

---

## 🚨 关键约束（不遵守 = 必须重做）

**1. 使用项目自定义组件（data-driven API），不使用 shadcn 风格。**

❌ 错误：
```tsx
<Table>
  <TableHeader><TableRow><TableHead>列</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>{item.x}</TableCell></TableRow></TableBody>
</Table>
```

✅ 正确：
```tsx
<Table
  columns={[
    { key: 'x', title: '列' },
    { key: 'status', title: '状态', render: (i) => <StatusBadge status={i.status} /> },
  ]}
  data={list}
  rowKey="id"
/>
```

**2. Import 路径必须大写**：`@/components/ui/Card`（不是 `card`）。

**3. 不要引入新 UI 库**（用项目自带的 Card/Button/Input/Select/Table/Modal/Badge/StatusBadge）。

**4. 不要写 shadcn 风格的 `<Dialog><DialogTrigger>`** — 用 `useState + <Modal>`。

---

## 可用组件 API

| 组件 | 用法 |
|------|------|
| `<Card>` / `<Card padding="none">` | 卡片容器 |
| `<Button variant="primary\|secondary\|ghost\|danger\|success" size="sm\|md\|lg" loading icon>` | 按钮 |
| `<Input label placeholder prefixIcon error>` | 输入框 |
| `<Select value onChange options={[{value,label}]}>` | 下拉（options 数组） |
| `<Table columns={[{key,title,width,render}]} data rowKey loading emptyText onRowClick>` | 表格（data-driven） |
| `<Modal open onClose title width footer>` | 弹窗 |
| `<StatusBadge status="running\|completed\|failed\|pending\|warning\|success\|error\|info">` | 状态徽章 |
| `<Badge variant="default\|secondary\|destructive\|success\|warning\|info\|outline">` | 多色标签 |
| `<Empty>` / `<Loading>` / `<Toast>` | 占位/加载/通知 |

---

## 视觉规范（必读）

| 用途 | Tailwind |
|------|----------|
| 页面背景 | `bg-[#111625]` |
| 卡片背景 | `bg-[#20293F]` |
| 二级容器 | `bg-[#181F32]` |
| 边框 | `border-[#2A354D]` |
| 主文字 | `text-slate-50` / `text-white` |
| 次文字 | `text-slate-400` |
| 蓝色（主） | `bg-[#0066FF]` / `text-blue-400` |
| 绿/红/橙/黄/紫 | `text-green-400` / `text-red-400` / `text-orange-400` / `text-yellow-400` / `text-purple-400` |

**状态徽章统一**（无 StatusBadge 时用这个）：
```tsx
<span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${
  status === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
  status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
  'bg-blue-500/20 text-blue-400 border-blue-500/40'
}`}>{text}</span>
```

---

## 完整页面模板（直接复制改）

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, X } from 'lucide-react';
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
  createdAt: string;
}

const mockData: Entity[] = [
  { id: 'E-001', name: '示例任务A', status: 'running', createdAt: '2026-06-03 10:00' },
  { id: 'E-002', name: '示例任务B', status: 'completed', createdAt: '2026-06-03 09:00' },
  { id: 'E-003', name: '示例任务C', status: 'failed', createdAt: '2026-06-03 08:00' },
  { id: 'E-004', name: '示例任务D', status: 'pending', createdAt: '2026-06-03 07:00' },
  { id: 'E-005', name: '示例任务E', status: 'completed', createdAt: '2026-06-03 06:00' },
];

const trendData = [
  { time: '00:00', count: 5 },
  { time: '04:00', count: 8 },
  { time: '08:00', count: 15 },
  { time: '12:00', count: 22 },
  { time: '16:00', count: 18 },
  { time: '20:00', count: 12 },
];

export function YourPageName() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Entity | null>(null);

  const stats = useMemo(() => ({
    total: mockData.length,
    running: mockData.filter(d => d.status === 'running').length,
    completed: mockData.filter(d => d.status === 'completed').length,
    failed: mockData.filter(d => d.status === 'failed').length,
  }), []);

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.name.includes(search)) return false;
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: 'ID', width: '120px' },
    { key: 'name', title: '名称' },
    { key: 'createdAt', title: '创建时间', width: '180px' },
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
      {/* 1. KPI 横排 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="运行中" value={stats.running} color="#22C55E" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="已完成" value={stats.completed} color="#10B981" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      {/* 2. 趋势图 */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">趋势（24h）</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Line type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 3. 标题 + 过滤工具栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">页面标题</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: 'running', label: '运行中' },
                { value: 'completed', label: '已完成' },
                { value: 'failed', label: '失败' },
              ]}
            />
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
          <Button size="sm"><Download className="w-3.5 h-3.5 mr-1" />导出</Button>
        </div>
      </div>

      {/* 4. 主表格 */}
      <Card padding="none">
        <Table columns={columns} data={filtered} rowKey="id" />
      </Card>

      {/* 5. 分页 */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      {/* 6. 详情 Modal */}
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
              <div className="bg-slate-800/50 rounded-lg p-3 col-span-2">
                <p className="text-slate-400 text-sm">创建时间</p>
                <p className="text-slate-50 mt-1">{selected.createdAt}</p>
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

## 禁止事项（红线）

❌ shadcn 风格（`<TableHeader><TableRow><TableCell>`、`<Dialog><DialogTrigger>`、`<CardContent>`、`<Label>`）
❌ 引入新 UI 库（antd / material-ui / shadcn 等）
❌ 引入新图表库（echarts / chart.js / d3）
❌ 引入不存在的 hooks（`@/hooks/useAsyncData` 等）
❌ Import 路径小写（必须大写：`@/components/ui/Card`）
❌ 修改 `menuData.ts` / `pageRegistry.tsx` / `globals.css` / `next.config.mjs`
❌ 写空 TODO 提交
❌ 写服务端代码（纯静态前端）

---

## 完成检查

- [ ] `'use client';` 在最顶部
- [ ] 使用项目自定义组件，无 shadcn
- [ ] Import 路径大写
- [ ] 6-10 条 mock data
- [ ] 至少 1 个交互（搜索/过滤/Modal/按钮）
- [ ] 状态徽章配色规范
- [ ] 文件大小 10-25 KB
- [ ] `export function` + `export default` 都有
- [ ] Build 通过（`npm run build`）

---

**参考实现**：
- `src/components/Pages/module1/taskMonitor/TaskRunMonitor.tsx`
- `src/components/Pages/module3/lateralMovement/LateralMovementView.tsx`
- `src/components/Pages/module4/vulnManage/VulnManageOverview.tsx`
