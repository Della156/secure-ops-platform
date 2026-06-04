'use client';

import { useState } from 'react';
import { Brain, Settings, Eye, Play, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

const mockDecisions = [
  { id: 'DEC-001', alertName: '暴力破解告警', strategy: '默认阻断策略', action: 'block', reason: '连续5次登录失败，触发暴力破解规则', status: 'executed', executedAt: '2024-01-15 10:30:00' },
  { id: 'DEC-002', alertName: 'DDoS攻击告警', strategy: '流量清洗策略', action: 'quarantine', reason: '检测到异常流量模式，疑似DDoS攻击', status: 'executed', executedAt: '2024-01-15 10:25:00' },
  { id: 'DEC-003', alertName: 'SQL注入告警', strategy: '默认忽略策略', action: 'ignore', reason: '置信度低于阈值，判定为误报', status: 'pending', executedAt: '-' },
  { id: 'DEC-004', alertName: '数据泄露告警', strategy: '数据防护策略', action: 'isolate', reason: '检测到敏感数据下载行为', status: 'executed', executedAt: '2024-01-15 10:15:00' },
  { id: 'DEC-005', alertName: 'XSS攻击告警', strategy: '默认阻断策略', action: 'block', reason: '检测到恶意脚本注入', status: 'executed', executedAt: '2024-01-15 10:05:00' },
];

const getActionStyle = (action: string) => {
  const styles: Record<string, string> = {
    block: 'bg-red-500/20 text-red-400 border-red-500/40',
    quarantine: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    isolate: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    ignore: 'bg-green-500/20 text-green-400 border-green-500/40',
  };
  return styles[action] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getActionText = (action: string) => {
  const texts: Record<string, string> = { block: '阻断', quarantine: '隔离', isolate: '隔离主机', ignore: '忽略' };
  return texts[action] || action;
};

const getStatusStyle = (status: string) => status === 'executed'
  ? 'bg-green-500/20 text-green-400 border-green-500/40'
  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';

const getStatusText = (status: string) => status === 'executed' ? '已执行' : '待执行';

export function AutoDecisionAnalysis() {
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<typeof mockDecisions[0] | null>(null);

  const columns = [
    { key: 'id', title: '决策ID', width: '120px' },
    { key: 'alertName', title: '告警名称' },
    { key: 'strategy', title: '匹配策略' },
    {
      key: 'action', title: '决策动作', width: '110px',
      render: (item: typeof mockDecisions[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getActionStyle(item.action)}`}>
          {getActionText(item.action)}
        </span>
      ),
    },
    {
      key: 'reason', title: '决策理由',
      render: (item: typeof mockDecisions[0]) => (
        <span className="text-slate-400 text-sm max-w-xs truncate block" title={item.reason}>{item.reason}</span>
      ),
    },
    {
      key: 'status', title: '执行状态', width: '100px',
      render: (item: typeof mockDecisions[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    { key: 'executedAt', title: '执行时间', width: '180px' },
    {
      key: 'actions', title: '操作', width: '150px',
      render: (item: typeof mockDecisions[0]) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDecision(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === 'pending' && <Button variant="ghost" size="sm" className="text-green-400"><Play className="w-4 h-4" /></Button>}
          {item.status === 'executed' && <Button variant="ghost" size="sm" className="text-blue-400"><RotateCcw className="w-4 h-4" /></Button>}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">自动化决策分析</h1>
          <p className="text-slate-400 mt-1">基于策略自动决策处置动作，支持策略配置和手动执行</p>
        </div>
        <Button variant="secondary" onClick={() => setConfigOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />策略配置
        </Button>
      </div>

      <Card padding="none">
        <Table columns={columns} data={mockDecisions} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      {/* 策略配置 Modal */}
      <Modal open={configOpen} onClose={() => setConfigOpen(false)} title="策略配置" width="max-w-lg">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">策略名称</label>
            <Input />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">匹配条件</label>
            <Input placeholder="告警级别=高危 AND 攻击类型=暴力破解" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">处置动作</label>
            <Select
              options={[
                { value: 'block', label: '阻断' },
                { value: 'quarantine', label: '隔离' },
                { value: 'isolate', label: '隔离主机' },
                { value: 'ignore', label: '忽略' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setConfigOpen(false)}>取消</Button>
            <Button variant="primary" onClick={() => setConfigOpen(false)}>保存策略</Button>
          </div>
        </div>
      </Modal>

      {/* 决策详情 Modal */}
      <Modal
        open={!!selectedDecision}
        onClose={() => setSelectedDecision(null)}
        title="决策详情"
        width="max-w-2xl"
      >
        {selectedDecision && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">决策ID</p>
                <p className="text-slate-50 font-mono mt-1">{selectedDecision.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">告警名称</p>
                <p className="text-slate-50 mt-1">{selectedDecision.alertName}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">匹配策略</p>
                <p className="text-slate-50 mt-1">{selectedDecision.strategy}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">决策动作</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getActionStyle(selectedDecision.action)}`}>
                  {getActionText(selectedDecision.action)}
                </span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm">决策理由</p>
              <p className="text-slate-300 text-sm mt-1">{selectedDecision.reason}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedDecision(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AutoDecisionAnalysis;
