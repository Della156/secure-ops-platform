'use client';

import { useState, useMemo } from 'react';
import { Activity, CheckCircle2, AlertCircle, Clock, RefreshCw, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DrillNode {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: string;
}

const mockNodes: DrillNode[] = [
  { id: 'N-001', name: '演练开始', type: '开始', status: 'success', duration: '0s' },
  { id: 'N-002', name: '停止主库写入', type: '数据库', status: 'success', duration: '12s' },
  { id: 'N-003', name: '从备份恢复数据', type: '数据库', status: 'running', duration: '5m 24s' },
  { id: 'N-004', name: '应用切到备库', type: '应用', status: 'pending', duration: '-' },
  { id: 'N-005', name: '业务验证', type: '验证', status: 'pending', duration: '-' },
  { id: 'N-006', name: '数据一致性比对', type: '验证', status: 'pending', duration: '-' },
  { id: 'N-007', name: '通知业务方', type: '通知', status: 'pending', duration: '-' },
  { id: 'N-008', name: '回滚 (失败时)', type: '回滚', status: 'pending', duration: '-' },
  { id: 'N-009', name: '演练结束', type: '结束', status: 'pending', duration: '-' },
];

export function DrillStatusMonitor() {
  const [selectedId, setSelectedId] = useState<string | null>('N-003');

  const stats = useMemo(() => ({
    total: mockNodes.length,
    success: mockNodes.filter(n => n.status === 'success').length,
    running: mockNodes.filter(n => n.status === 'running').length,
    pending: mockNodes.filter(n => n.status === 'pending').length,
    failed: mockNodes.filter(n => n.status === 'failed').length,
  }), []);

  const progress = useMemo(() => ((stats.success + stats.running) / stats.total) * 100, [stats]);
  const selected = mockNodes.find(n => n.id === selectedId) || null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'running': return <Activity className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">演练任务状态监控</h2>
            <p className="text-xs text-slate-500 mt-1">核心数据库恢复演练 - 执行中</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新状态</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#111625] rounded-lg p-3">
            <p className="text-xs text-slate-500">总节点</p>
            <p className="text-xl font-semibold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-[#111625] rounded-lg p-3">
            <p className="text-xs text-slate-500">已完成</p>
            <p className="text-xl font-semibold text-green-400 mt-1">{stats.success}</p>
          </div>
          <div className="bg-[#111625] rounded-lg p-3">
            <p className="text-xs text-slate-500">进行中</p>
            <p className="text-xl font-semibold text-blue-400 mt-1">{stats.running}</p>
          </div>
          <div className="bg-[#111625] rounded-lg p-3">
            <p className="text-xs text-slate-500">待执行</p>
            <p className="text-xl font-semibold text-slate-400 mt-1">{stats.pending}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>整体进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {mockNodes.map((node, index) => (
            <div
              key={node.id}
              onClick={() => setSelectedId(node.id)}
              className={`bg-slate-800/50 rounded-lg p-4 cursor-pointer transition-all ${
                selectedId === node.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'
              } ${index > 0 && index < mockNodes.length - 1 ? 'border-l-4' : ''} ${
                node.status === 'success' ? 'border-l-green-500' :
                node.status === 'running' ? 'border-l-blue-500' :
                node.status === 'failed' ? 'border-l-red-500' : 'border-l-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    node.status === 'success' ? 'bg-green-500/20' :
                    node.status === 'running' ? 'bg-blue-500/20' :
                    node.status === 'failed' ? 'bg-red-500/20' : 'bg-slate-700'
                  }`}>
                    {getStatusIcon(node.status)}
                  </span>
                  <div>
                    <p className="text-slate-50 font-medium">{node.name}</p>
                    <p className="text-xs text-slate-500">类型: {node.type} | ID: {node.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusBadgeClass(node.status)}`}>
                    {node.status === 'success' ? '完成' : node.status === 'running' ? '执行中' : node.status === 'failed' ? '失败' : '待执行'}
                  </span>
                  <span className="text-xs text-slate-500">{node.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-400" />节点详情
            </h3>
          </div>
          {selected ? (
            <div className="space-y-3">
              <div className="bg-[#111625] rounded-lg p-3">
                <p className="text-xs text-slate-500">节点ID</p>
                <p className="text-slate-300 font-mono mt-1">{selected.id}</p>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <p className="text-xs text-slate-500">节点名称</p>
                <p className="text-slate-300 mt-1">{selected.name}</p>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <p className="text-xs text-slate-500">节点类型</p>
                <p className="text-slate-300 mt-1">{selected.type}</p>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <p className="text-xs text-slate-500">状态</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getStatusBadgeClass(selected.status)}`}>
                  {selected.status === 'success' ? '完成' : selected.status === 'running' ? '执行中' : selected.status === 'failed' ? '失败' : '待执行'}
                </span>
              </div>
              <div className="bg-[#111625] rounded-lg p-3">
                <p className="text-xs text-slate-500">执行时长</p>
                <p className="text-slate-300 mt-1">{selected.duration}</p>
              </div>
              {selected.status === 'running' && (
                <Button variant="danger" size="sm" className="w-full">停止执行</Button>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm py-8">
              <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              选择节点查看详情
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DrillStatusMonitor;