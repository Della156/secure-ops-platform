'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

const mockAlerts = [
  { id: 'ALT-001', originalAlert: '多次登录失败', attackType: '暴力破解', result: 'true_attack', confidence: 0.95, detectedAt: '2024-01-15 10:30:00' },
  { id: 'ALT-002', originalAlert: '异常网络流量', attackType: 'DDoS攻击', result: 'true_attack', confidence: 0.88, detectedAt: '2024-01-15 10:25:00' },
  { id: 'ALT-003', originalAlert: 'SQL注入尝试', attackType: 'SQL注入', result: 'false_positive', confidence: 0.35, detectedAt: '2024-01-15 10:20:00' },
  { id: 'ALT-004', originalAlert: '可疑文件下载', attackType: '数据泄露', result: 'true_attack', confidence: 0.72, detectedAt: '2024-01-15 10:15:00' },
  { id: 'ALT-005', originalAlert: '端口扫描', attackType: '端口扫描', result: 'false_positive', confidence: 0.28, detectedAt: '2024-01-15 10:10:00' },
  { id: 'ALT-006', originalAlert: 'XSS攻击尝试', attackType: 'XSS攻击', result: 'true_attack', confidence: 0.85, detectedAt: '2024-01-15 10:05:00' },
];

const getResultStyle = (result: string) => result === 'true_attack'
  ? 'bg-red-500/20 text-red-400 border-red-500/40'
  : 'bg-green-500/20 text-green-400 border-green-500/40';

const getResultText = (result: string) => result === 'true_attack' ? '真实攻击' : '误报';

const getConfidenceColor = (confidence: number) =>
  confidence >= 0.8 ? 'bg-red-500' : confidence >= 0.5 ? 'bg-yellow-500' : 'bg-green-500';

export function AlertFastScreening() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<typeof mockAlerts[0] | null>(null);

  const filteredAlerts = mockAlerts.filter(alert =>
    alert.originalAlert.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.attackType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'id', title: '告警ID', width: '120px' },
    { key: 'originalAlert', title: '原始告警' },
    { key: 'attackType', title: '攻击类型分类' },
    {
      key: 'result', title: '甄别结果', width: '120px',
      render: (item: typeof mockAlerts[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getResultStyle(item.result)}`}>
          {item.result === 'true_attack' ? <XCircle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
          {getResultText(item.result)}
        </span>
      ),
    },
    {
      key: 'confidence', title: '置信度', width: '180px',
      render: (item: typeof mockAlerts[0]) => (
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
      key: 'actions', title: '操作', width: '260px',
      render: (item: typeof mockAlerts[0]) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-green-400">确认攻击</Button>
          <Button variant="ghost" size="sm" className="text-blue-400">标记误报</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">告警行为快速甄别</h1>
        <p className="text-slate-400 mt-1">快速甄别告警是否为真实攻击，支持人工确认和标记误报</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="搜索告警内容或攻击类型..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card padding="none">
        <Table columns={columns} data={filteredAlerts} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="告警详情"
        width="max-w-2xl"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">告警ID</p>
                <p className="text-slate-50 font-mono mt-1">{selectedAlert.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">攻击类型</p>
                <p className="text-slate-50 mt-1">{selectedAlert.attackType}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">甄别结果</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getResultStyle(selectedAlert.result)}`}>
                  {getResultText(selectedAlert.result)}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">置信度</p>
                <p className="text-slate-50 mt-1">{(selectedAlert.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedAlert(null)}>关闭</Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">确认攻击</Button>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">标记误报</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AlertFastScreening;
