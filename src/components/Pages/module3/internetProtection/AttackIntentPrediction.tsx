'use client';

import { useState } from 'react';
import { Target, AlertTriangle, Eye, Settings, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

const mockAttackEvents = [
  { id: 'AIE-001', sourceIp: '192.168.1.100', technique: '端口扫描', frequency: '高频', target: 'Web服务器群', intent: 'scan', confidence: 0.85, detectedAt: '2024-01-15 10:30:00' },
  { id: 'AIE-002', sourceIp: '10.0.0.50', technique: 'SQL注入', frequency: '中频', target: '数据库服务器', intent: 'penetration', confidence: 0.92, detectedAt: '2024-01-15 10:25:00' },
  { id: 'AIE-003', sourceIp: '172.16.0.25', technique: 'DDoS攻击', frequency: '高频', target: '边界防火墙', intent: 'destruction', confidence: 0.98, detectedAt: '2024-01-15 10:20:00' },
  { id: 'AIE-004', sourceIp: '192.168.2.150', technique: 'XSS攻击', frequency: '低频', target: '门户网站', intent: 'penetration', confidence: 0.75, detectedAt: '2024-01-15 10:15:00' },
  { id: 'AIE-005', sourceIp: '10.5.0.30', technique: '暴力破解', frequency: '高频', target: 'VPN网关', intent: 'scan', confidence: 0.88, detectedAt: '2024-01-15 10:10:00' },
  { id: 'AIE-006', sourceIp: '192.168.3.200', technique: '横向移动', frequency: '中频', target: '内网服务器', intent: 'penetration', confidence: 0.90, detectedAt: '2024-01-15 10:05:00' },
];

const getIntentLabel = (intent: string) => {
  const labels: Record<string, string> = { scan: '扫描探测', penetration: '渗透攻击', destruction: '破坏攻击' };
  return labels[intent] || intent;
};

const getIntentStyle = (intent: string) => {
  const styles: Record<string, string> = {
    scan: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    penetration: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    destruction: 'bg-red-500/20 text-red-400 border-red-500/40',
  };
  return styles[intent] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getFrequencyStyle = (frequency: string) => {
  const styles: Record<string, string> = {
    '高频': 'bg-red-500/20 text-red-400 border-red-500/40',
    '中频': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    '低频': 'bg-green-500/20 text-green-400 border-green-500/40',
  };
  return styles[frequency] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getConfidenceColor = (confidence: number) =>
  confidence >= 0.9 ? 'bg-red-500' : confidence >= 0.8 ? 'bg-orange-500' : 'bg-yellow-500';

export function AttackIntentPrediction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockAttackEvents[0] | null>(null);

  const filteredEvents = mockAttackEvents.filter(event =>
    event.sourceIp.includes(searchQuery) || event.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'id', title: '事件ID', width: '120px' },
    { key: 'sourceIp', title: '攻击源IP', width: '160px', render: (item: typeof mockAttackEvents[0]) => <span className="font-mono">{item.sourceIp}</span> },
    { key: 'technique', title: '攻击手法' },
    {
      key: 'frequency', title: '攻击频率', width: '100px',
      render: (item: typeof mockAttackEvents[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getFrequencyStyle(item.frequency)}`}>
          {item.frequency}
        </span>
      ),
    },
    { key: 'target', title: '攻击目标' },
    {
      key: 'intent', title: '预测意图', width: '110px',
      render: (item: typeof mockAttackEvents[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getIntentStyle(item.intent)}`}>
          {getIntentLabel(item.intent)}
        </span>
      ),
    },
    {
      key: 'confidence', title: '置信度', width: '180px',
      render: (item: typeof mockAttackEvents[0]) => (
        <div className="flex items-center">
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
            <div className={`h-full ${getConfidenceColor(item.confidence)}`} style={{ width: `${item.confidence * 100}%` }} />
          </div>
          <span>{(item.confidence * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    { key: 'detectedAt', title: '检测时间', width: '180px' },
    {
      key: 'actions', title: '操作', width: '80px',
      render: (item: typeof mockAttackEvents[0]) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(item)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">攻击意图自动预测</h1>
          <p className="text-slate-400 mt-1">基于攻击行为特征，自动预测攻击者意图</p>
        </div>
        <Button variant="secondary" onClick={() => setConfigOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />配置预测模型
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">扫描探测</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">渗透攻击</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">破坏攻击</p>
              <p className="text-2xl font-bold text-red-400 mt-1">1</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="搜索IP地址或目标..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card padding="none">
        <Table columns={columns} data={filteredEvents} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      {/* 预测模型配置 */}
      <Modal open={configOpen} onClose={() => setConfigOpen(false)} title="预测模型配置" width="max-w-lg">
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-slate-50 font-semibold mb-3">模型参数</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-slate-400">置信度阈值</span><span className="text-slate-50">0.75</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">检测频率</span><span className="text-slate-50">5分钟</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">历史数据窗口</span><span className="text-slate-50">24小时</span></div>
            </div>
          </div>
          <Button variant="primary" className="w-full" onClick={() => setConfigOpen(false)}>保存配置</Button>
        </div>
      </Modal>

      {/* 攻击意图详情 */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="攻击意图详情" width="max-w-2xl">
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">攻击源IP</p>
                <p className="text-slate-50 font-mono mt-1">{selectedEvent.sourceIp}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">攻击手法</p>
                <p className="text-slate-50 mt-1">{selectedEvent.technique}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">预测意图</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getIntentStyle(selectedEvent.intent)}`}>
                  {getIntentLabel(selectedEvent.intent)}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">置信度</p>
                <p className="text-slate-50 mt-1">{(selectedEvent.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-2">意图分析</p>
              <p className="text-slate-300 text-sm">
                根据攻击行为特征分析，该攻击源采用{selectedEvent.technique}手法，
                针对{selectedEvent.target}发起{selectedEvent.frequency}攻击，
                预测意图为{getIntentLabel(selectedEvent.intent)}，置信度{(selectedEvent.confidence * 100).toFixed(0)}%。
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedEvent(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AttackIntentPrediction;
