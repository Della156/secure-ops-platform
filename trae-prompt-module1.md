# Trae 提示词 —— 「网络安全自动任务配置」模块页面设计

## 项目定位：data-driven / options-based 风格

### 核心原则
1. **不写 shadcn/ui 标签**：不用 `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>` 等 JSX 嵌套写法
2. **只用项目自定义 data-driven 组件**：全部通过 `columns={[...]} data={[...]} rowKey="id"` 配置驱动
3. **筛选条件 options-based**：搜索栏 + Select 下拉 + 状态标签切换，通过配置 options 数组驱动
4. **统计数据 KPI 卡片**：页面顶部用 StatsCardGrid + StatsCard 展示汇总数据

### 可用组件清单

```tsx
// === 表格（核心组件） ===
import { Table } from '@/components/ui/Table'
// 用法：<Table columns={colDefs} data={dataList} rowKey="id" loading={bool} onRowClick={fn} actions={(item)=>...} />
// columns定义：{ key: string, title: string, render?: (item: T) => ReactNode, sortable?: boolean, width?: string }

// === 按钮 ===
import { Button } from '@/components/ui/Button'
// variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

// === 状态标签 ===
import { StatusBadge } from '@/components/Common/StatusBadge'
// status取值: running/completed/failed/pending/success/error/warning/info/approved/rejected/active/expired/online/offline

// === 统计卡片 ===
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard'
// <StatsCard title="总数" value="128" icon={<Icon />} color="default|blue|green|yellow|red|purple" />

// === 搜索筛选 ===
import { SearchBar, FilterTabs } from '@/components/Common/SearchBar'
// <SearchBar value={s} onChange={(v) => setS(v)} placeholder="搜索..." />

// === 分页 ===
import { Pagination } from '@/components/Common/DataTable'
// <Pagination page={n} totalPages={n} total={n} pageSize={n} onPageChange={fn} />

// === 选择器 ===
import { Select } from '@/components/ui/Select'
// 简单模式：<Select options={[{value,label}]} value={s} onChange={(e) => setS(e.target.value)} />
// 注意：Select 接受原生 onChange(e)，子代理需要写 onChange={(e) => setX(e.target.value)}，不能直接 setX

// === 模态框 ===
import { Modal } from '@/components/ui/Modal'
// <Modal open={bool} onClose={fn} title="标题" width="max-w-lg" footer={ReactNode}>children</Modal>

// === 页面结构 ===
import { PageHeader, LoadingState, EmptyState } from '@/components/Common/PageStates'
// <PageHeader title="页面标题" description="页面描述" />
```

### 颜色体系（严格遵循）
```
卡片背景: bg-[#20293F]
输入框/表头: bg-[#181F32]
边框: border-[#2A354D]
主文字: text-[#F3F4F6]
次要文字: text-[#9CA3AF]
蓝色: #0066FF
绿色: #00C853
红色: #FF3B30
橙色: #FF9100
```

### 标准页面结构

```tsx
'use client';

import React, { useState } from 'react';
import { Icon1, Icon2 } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { SearchBar } from '@/components/Common/SearchBar';
import { Pagination } from '@/components/Common/DataTable';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/Common/PageStates';

// 1. 接口定义
interface MyItem {
  id: string;
  name: string;
  status: string;
  // ...
}

// 2. Mock 数据
const mockData: MyItem[] = [...];

// 3. 组件
export function MyPage() {
  const [data, setData] = useState(mockData);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 筛选
  const filtered = data.filter(item => {
    const matchName = item.name.includes(searchText);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  // 统计
  const stats = { total: data.length, online: ..., offline: ... };

  // Table 列定义
  const columns = [
    { key: 'name', title: '名称', render: (item) => <span>...</span> },
    { key: 'status', title: '状态', render: (item) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div>
      <PageHeader title="页面标题" description="页面描述" />

      {/* KPI 统计卡片 */}
      <StatsCardGrid>
        <StatsCard title="总数" value={String(stats.total)} icon={<Icon />} color="default" />
        <StatsCard title="在线" value={String(stats.online)} icon={<Icon />} color="green" />
      </StatsCardGrid>

      {/* 筛选栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 items-center">
            <SearchBar value={searchText} onChange={setSearchText} placeholder="搜索..." />
            <Select options={[{value:'',label:'全部状态'}]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
          </div>
          <Button variant="primary" icon={<Plus />}>新增</Button>
        </div>
      </div>

      {/* 表格 */}
      <Table columns={columns} data={filtered} rowKey="id" actions={(item) => (
        <Button variant="ghost" size="sm" icon={<Edit />} onClick={() => {}} />
      )} />

      {/* 分页 */}
      <Pagination page={page} totalPages={Math.ceil(filtered.length/pageSize)} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />

      {/* 模态框 */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="新增" footer={<div>...</div>}>
        <div className="space-y-4">...</div>
      </Modal>
    </div>
  );
}
```

### ❌ 常见错误（禁止做）

| 错误写法 | 正确写法 |
|---|---|
| `<Table><TableHeader><TableRow>...` | `<Table columns={cols} data={data} rowKey="id" />` |
| `<button onClick={fn}>` | `<Button variant="primary" onClick={fn}>` |
| `<span className="status-badge">` | `<StatusBadge status="running" />` |
| `<div className="fixed inset-0 modal">` | `<Modal open={bool} onClose={fn}>` |
| `<SearchBar onChange={(e) => setX(e.target.value)}>` | `<SearchBar onChange={setX}>`（SearchBar 的 onChange 直接传 string）|
| `<Select onChange={setX}>` | `<Select onChange={(e) => setX(e.target.value)}>`（Select 传原生 event）|
| `<StatsCard icon={Icon}>` | `<StatsCard icon={<Icon className="w-5 h-5" />}>` |
| `<StatsCardGrid className="...">` | StatsCardGrid 不接受 className，单独包装 |
| `<StatsCard color="#0066FF">` | `<StatsCard color="blue">`（只用 blue/green/yellow/red/purple/default）|
| `<Pagination current={page} total={n} onChange={fn}>` | `<Pagination page={page} totalPages={n} total={n} pageSize={10} onPageChange={fn}>` |

### 实现顺序

1. 先写接口和数据（types + mock）
2. 再写 StatsCardGrid 统计行
3. 再写筛选栏（SearchBar + Select）
4. 再写 Table（columns 定义 + data 绑定 + actions）
5. 再写 Pagination
6. 最后写 Modal（新增/编辑/详情）
