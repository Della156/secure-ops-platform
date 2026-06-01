# 模块开发规范指南

> 网络安全智能化运维平台 — 骨架组件使用指南

---

## 1. 欢迎使用骨架

本平台已提供以下基础设施，模块 2-6 开发时可直接引用：

```
src/
├── components/
│   ├── PageShell.tsx       # 统一页面壳（面包屑、标题、Loading、Error）
│   ├── ui/                 # 基础 UI 组件库
│   │   ├── Button.tsx      # 按钮（primary/secondary/ghost/danger/success）
│   │   ├── Input.tsx       # 输入框（支持 label/error/图标前缀后缀）
│   │   ├── Select.tsx      # 下拉选择器
│   │   ├── Table.tsx       # 通用表格（排序/筛选/loading/空态）
│   │   ├── Modal.tsx       # 模态框（ESC 关闭/遮罩/标题/底部操作区）
│   │   ├── Card.tsx        # 卡片容器（hover 效果/多种内边距）
│   │   ├── Empty.tsx       # 空状态占位
│   │   └── Loading.tsx     # 加载动画（全页/内联/多种大小）
│   ├── pages/
│   │   └── PageRouter.tsx  # 页面路由（根据 activeMenu 自动渲染）
│   │   └── PageContent.tsx # 页面入口（包裹 PageShell + 面包屑）
│   └── Layout/
│       └── MainLayout.tsx  # 主布局
├── contexts/
│   └── SystemContext.tsx   # 全局状态（当前菜单、风险评分、待办）
├── data/
│   ├── menuData.ts         # 菜单配置
│   └── pageRegistry.tsx    # 页面注册表（菜单ID → 页面组件）
└── types/
    └── index.ts            # 类型定义
```

---

## 2. 添加新页面的标准流程

### 2.1 创建页面组件

```tsx
// src/components/Pages/module2/DeviceRunCheck.tsx
'use client';

import React from 'react';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export function DeviceRunCheck() {
  return (
    <PageShell
      title="设备运行状态检查"
      description="查看所有设备的运行状态和健康指标"
      breadcrumb={[
        { label: '网络安全自动运维' },
        { label: '设备运行状态检查' },
      ]}
      actions={<Button>新增检查</Button>}
    >
      {/* 业务内容 */}
    </PageShell>
  );
}
```

### 2.2 注册到 pageRegistry

在 `src/data/pageRegistry.tsx` 中添加：

```typescript
import dynamic from 'next/dynamic';

const DeviceRunCheck = dynamic(() => import(
  '@/components/Pages/module2/DeviceRunCheck'
).then(m => ({ default: m.DeviceRunCheck })));

export const pageRegistry: Record<string, ComponentType<any>> = {
  // ... 已有映射
  'menu-2-1': DeviceRunCheck,
};
```

### 2.3 使用 UI 组件示例

```tsx
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Empty } from '@/components/ui/Empty';
import { Loading } from '@/components/ui/Loading';

// 标准 CRUD 模式
function MyPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data] = useState([...]);

  return (
    <div>
      {/* 搜索栏 */}
      <div className="flex gap-3 mb-4">
        <Input placeholder="搜索..." prefixIcon={<Search className="w-4 h-4" />} />
        <Select options={[{ value: 'all', label: '全部状态' }]} />
        <Button variant="primary">搜索</Button>
      </div>

      {/* 表格 */}
      <Table
        columns={[
          { key: 'name', title: '名称' },
          { key: 'status', title: '状态', render: (item) => (
            <span className={item.status === 'normal' ? 'text-[#00C853]' : 'text-[#FF3B30]'}>
              {item.status}
            </span>
          )},
        ]}
        data={data}
        rowKey="id"
        actions={(item) => (
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)}>
            编辑
          </Button>
        )}
      />

      {/* 模态框 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="编辑">
        <p>表单内容</p>
      </Modal>
    </div>
  );
}
```

---

## 3. 页面类型模板

### 类型 A：标准 CRUD 列表

```
PageShell
├── 搜索栏（Input + Select + 搜索按钮）
├── 新增按钮
├── Table（带排序 + 操作列）
└── Modal（新增/编辑表单）
```

**适合**：任务接入管理、设备列表、接口配置、日志查询

### 类型 B：监控仪表盘

```
PageShell
├── 顶部统计卡片（Card 网格，4 个）
├── 图表区域（Recharts 图表）
└── 日志/列表区域
```

**适合**：运行监控、执行进度、资源使用率

### 类型 C：配置向导

```
PageShell
├── 步骤条
├── 当前步骤内容区（自定义）
└── 上一步/下一步 按钮
```

**适合**：任务在线注册、连接测试

---

## 4. 色值使用规范

所有页面 MUST 使用 XSOAR 色值，**禁止**使用 Tailwind 默认色：

```tsx
// ✅ 正确
className="bg-[#111625]"     // 画布背景
className="bg-[#20293F]"     // 卡片/面板
className="bg-[#181F32]"     // 表面/工作区
className="bg-[#2A354D]"     // 边框/分割线
className="text-[#F3F4F6]"   // 主标题/正文
className="text-[#D1D5DB]"   // 标签文字
className="text-[#9CA3AF]"   // 描述/次要文字
className="text-[#6B7280]"   // 禁用/占位
className="text-[#0066FF]"   // 主色蓝
className="text-[#FF3B30]"   // 危险红
className="text-[#00C853]"   // 成功绿
className="text-[#FF9100]"   // 警告黄
className="text-[#6366F1]"   // AI 紫

// ❌ 错误
className="text-white"
className="bg-slate-800"
className="text-blue-500"
className="border-gray-700"
```

---

## 5. 图标使用

使用 lucide-react：

```tsx
import { Plus, Search, Edit, Trash2, RefreshCw, Download, Upload } from 'lucide-react';

// 尺寸建议：
<Icon className="w-4 h-4" />   // 按钮图标
<Icon className="w-5 h-5" />   // 标题/表格操作
<Icon className="w-8 h-8" />   // 空状态/大图标
```

---

## 6. 最佳实践

| 原则 | 说明 |
|------|------|
| 每个页面组件以 `export function` 导出 | 便于 dynamic import |
| 文件命名 PascalCase | DeviceRunCheck.tsx |
| 使用 `'use client'` | 所有页面组件都需要 |
| 模拟数据放文件底部或 useMockData hook | 便于后续替换为真实 API |
| 页面组件不依赖 router | 通过 SystemContext 获取 activeMenu |
| 标准 CRUD 优先用 SchemaListPage | 后续提供 Schema 模板 |

---

## 7. 模块目录结构

```
src/components/Pages/module2/
├── deviceCheck/
│   └── DeviceRunCheck.tsx
├── policyCheck/
│   └── PolicyCheckView.tsx
├── baseline/
│   ├── OsBaselineCheck.tsx
│   ├── MiddlewareBaselineCheck.tsx
│   └── DatabaseBaselineCheck.tsx
├── ...
```

每个子目录对应一个二级菜单分组，目录名使用 camelCase。
