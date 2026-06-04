'use client';

import { useState, useMemo } from 'react';
import { Play, Square, RotateCcw, CheckCircle2, AlertCircle, Clock, Eye, Terminal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface ExecTask {
  id: string;
  name: string;
  type: 'start' | 'stop' | 'restart';
  target: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  startTime: string;
  endTime: string;
  duration: string;
  logs: string[];
}

const mockData: ExecTask[] = [
  { 
    id: 'EXEC-001', 
    name: '应用服务器重启', 
    type: 'restart', 
    target: 'app-01', 
    status: 'running', 
    startTime: '2026-06-03 10:30:00', 
    endTime: '-', 
    duration: '2m 15s',
    logs: [
      '2026-06-03 10:30:00 - 开始执行重启任务',
      '2026-06-03 10:30:05 - 发送停止信号到服务',
      '2026-06-03 10:30:12 - 等待服务停止...',
      '2026-06-03 10:31:08 - 服务已停止',
      '2026-06-03 10:31:10 - 启动服务...',
      '2026-06-03 10:32:15 - 服务启动中...',
    ]
  },
  { 
    id: 'EXEC-002', 
    name: '数据库主库维护停止', 
    type: 'stop', 
    target: 'mysql-master-01', 
    status: 'completed', 
    startTime: '2026-06-03 02:00:00', 
    endTime: '2026-06-03 02:05:32', 
    duration: '5m 32s',
    logs: []
  },
  { 
    id: 'EXEC-003', 
    name: '缓存集群重启', 
    type: 'restart', 
    target: 'redis-01', 
    status: 'pending', 
    startTime: '-', 
    endTime: '-', 
    duration: '-',
    logs: []
  },
  { 
    id: 'EXEC-004', 
    name: '日志服务启动', 
    type: 'start', 
    target: 'log-server-01', 
    status: 'completed', 
    startTime: '2026-06-01 08:00:00', 
    endTime: '2026-06-01 08:02:15', 
    duration: '2m 15s',
    logs: []
  },
  { 
    id: 'EXEC-005', 
    name: '监控服务重启', 
    type: 'restart', 
    target: 'monitor-server', 
    status: 'failed', 
    startTime: '2026-05-25 02:00:00', 
    endTime: '2026-05-25 02:08:45', 
    duration: '8m 45s',
    logs: []
  },
];

export function StartStopExec() {
  const [selectedTask, setSelectedTask] = useState<ExecTask | null>(null);

  const stats = useMemo(() => ({
    total: mockData.length,
    completed: mockData.filter(d => d.status === 'completed').length,
    running: mockData.filter(d => d.status === 'running').length,
    pending: mockData.filter(d => d.status === 'pending').length,
    failed: mockData.filter(d => d.status === 'failed').length,
  }), []);

  const columns = [
    { key: 'id', title: '执行ID', width: '100px' },
    { key: 'name', title: '任务名称' },
    {
      key: 'type', title: '操作类型', width: '100px',
      render: (item: ExecTask) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${
          item.type === 'start' ? 'bg-green-500/20 text-green-400' :
          item.type === 'stop' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {item.type === 'start' ? '启动' : item.type === 'stop' ? '停止' : '重启'}
        </span>
      ),
    },
    { key: 'target', title: '目标对象', width: '150px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: ExecTask) => <StatusBadge status={item.status} />,
    },
    { key: 'startTime', title: '开始时间', width: '160px' },
    { key: 'duration', title: '执行时长', width: '100px' },
    {
      key: 'actions', title: '操作', width: '180px',
      render: (item: ExecTask) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTask(item)}>
            <Eye className="w-3 h-3 mr-1" />查看日志
          </Button>
          {item.status === 'pending' && (
            <Button variant="primary" size="sm">
              <Play className="w-3 h-3 mr-1" />执行
            </Button>
          )}
          {item.status === 'running' && (
            <>
              <Button variant="danger" size="sm">
                <Square className="w-3 h-3 mr-1" />停止
              </Button>
              <Button variant="secondary" size="sm">
                <RotateCcw className="w-3 h-3 mr-1" />重试
              </Button>
            </>
          )}
          {item.status === 'failed' && (
            <Button variant="primary" size="sm">
              <RotateCcw className="w-3 h-3 mr-1" />重试
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">总执行数</span>
            <span className="text-blue-400"><Terminal className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">已完成</span>
            <span className="text-green-400"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">执行中</span>
            <span className="text-blue-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">失败</span>
            <span className="text-red-400"><AlertCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white">系统启停执行</h2>
      </div>

      <Card padding="none">
        <Table columns={columns} data={mockData} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)} title={`${selectedTask?.name} - 执行日志`} width="max-w-3xl">
        {selectedTask && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">执行ID</p>
                <p className="text-slate-300 font-mono text-sm">{selectedTask.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">目标对象</p>
                <p className="text-slate-300 text-sm">{selectedTask.target}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">状态</p>
                <StatusBadge status={selectedTask.status} />
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">执行时长</p>
                <p className="text-slate-300 text-sm">{selectedTask.duration}</p>
              </div>
            </div>
            
            <div className="bg-[#0d1117] rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700 bg-slate-800/50">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">执行日志</span>
              </div>
              <div className="p-4 h-64 overflow-y-auto font-mono text-xs">
                {selectedTask.logs.length > 0 ? (
                  selectedTask.logs.map((log, index) => (
                    <div key={index} className="text-slate-400 mb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 text-center py-8">
                    暂无日志信息
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedTask(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default StartStopExec;