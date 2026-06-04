'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Eye, Download, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

interface HistoryItem {
  id: string;
  name: string;
  status: 'completed' | 'failed';
  startTime: string;
  endTime: string;
  duration: string;
  target: string;
  messageCount: number;
}

const mockData: HistoryItem[] = [
  { id: 'ELK-002', name: '威胁情报共享', status: 'completed', startTime: '2026-06-02 14:00:00', endTime: '2026-06-02 14:02:15', duration: '2分钟', target: '市级平台A', messageCount: 8 },
  { id: 'ELK-004', name: '攻击溯源信息同步', status: 'completed', startTime: '2026-06-01 10:00:00', endTime: '2026-06-01 10:03:45', duration: '3分钟', target: '省级平台', messageCount: 12 },
  { id: 'ELK-005', name: '应急响应通知', status: 'failed', startTime: '2026-06-03 08:00:00', endTime: '2026-06-03 08:01:20', duration: '1分钟', target: '市级平台C', messageCount: 3 },
];

export function ElinkHistory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filtered = useMemo(() => mockData.filter(item => {
    if (search && !item.name.includes(search)) return false;
    if (filter !== 'all' && item.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'target', title: '目标平台', width: '120px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: HistoryItem) => (
        <span className={`text-xs px-2 py-0.5 rounded ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {item.status === 'completed' ? '成功' : '失败'}
        </span>
      ),
    },
    { key: 'startTime', title: '开始时间', width: '160px' },
    { key: 'duration', title: '耗时', width: '80px' },
    { key: 'messageCount', title: '消息数', width: '80px' },
    {
      key: 'actions', title: '操作', width: '80px',
      render: (item: HistoryItem) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
          <Eye className="w-3 h-3 mr-1" />详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK协同联动任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">查询已完成的ELINK协同联动任务记录</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="搜索任务名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="w-32">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部' },
              { value: 'completed', label: '成功' },
              { value: 'failed', label: '失败' },
            ]}
          />
        </div>
        <Button size="sm"><Download className="w-3.5 h-3.5 mr-1" />导出</Button>
      </div>

      <Card padding="none">
        <Table columns={columns} data={filtered} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.name || '任务详情'}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">任务ID</p>
                <p className="text-sm text-white font-mono">{selectedItem.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">状态</p>
                <span className={`text-sm px-2 py-0.5 rounded ${selectedItem.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {selectedItem.status === 'completed' ? '成功' : '失败'}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">目标平台</p>
                <p className="text-sm text-white">{selectedItem.target}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">消息数</p>
                <p className="text-sm text-white">{selectedItem.messageCount}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>关闭</Button>
              <Button variant="primary">查看报告</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ElinkHistory;