'use client';

import { useState, useMemo } from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle, Play, Pause, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Task {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  currentStage: string;
  startTime: string;
  estimatedTime: string;
}

const mockTasks: Task[] = [
  { id: 'ELK-001', name: '安全告警协同推送', status: 'running', progress: 75, currentStage: '消息发送中', startTime: '2026-06-03 09:00:00', estimatedTime: '2分钟' },
  { id: 'ELK-002', name: '威胁情报共享', status: 'completed', progress: 100, currentStage: '完成', startTime: '2026-06-02 14:00:00', estimatedTime: '-' },
  { id: 'ELK-003', name: '事件协查请求', status: 'pending', progress: 0, currentStage: '等待执行', startTime: '-', estimatedTime: '5分钟' },
  { id: 'ELK-004', name: '攻击溯源信息同步', status: 'completed', progress: 100, currentStage: '完成', startTime: '2026-06-01 10:00:00', estimatedTime: '-' },
];

export function ElinkStatus() {
  const [tasks, setTasks] = useState(mockTasks);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-5 h-5 text-green-400" />;
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'running': return 'border-green-500/30';
      case 'completed': return 'border-green-500/20';
      case 'failed': return 'border-red-500/30';
      case 'pending': return 'border-yellow-500/30';
      default: return 'border-slate-600';
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return task.status === 'running' 
          ? { ...task, status: 'pending' as const }
          : { ...task, status: 'running' as const };
      }
      return task;
    }));
  };

  const stats = useMemo(() => ({
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  }), [tasks]);

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK协同联动任务状态监控</h2>
            <p className="text-xs text-slate-500 mt-1">实时监控ELINK协同联动任务执行状态</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">运行中</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs text-slate-400">已完成</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">待执行</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.pending}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-slate-400">失败</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <Card key={task.id} padding="p-4" className={`border ${statusColor(task.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${task.status === 'running' ? 'bg-green-500/20' : task.status === 'completed' ? 'bg-green-500/10' : task.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                  {statusIcon(task.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{task.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{task.id}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400">当前阶段: <span className="text-slate-300">{task.currentStage}</span></span>
                  </div>
                </div>
              </div>
              <Button 
                variant={task.status === 'running' ? 'secondary' : 'primary'} 
                size="sm"
                onClick={() => toggleTask(task.id)}
              >
                {task.status === 'running' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {task.status === 'running' ? '暂停' : '启动'}
              </Button>
            </div>
            {task.status !== 'pending' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>进度</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${task.status === 'completed' ? 'bg-green-500' : task.status === 'failed' ? 'bg-red-500' : 'bg-green-400'}`} 
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span>开始时间: {task.startTime}</span>
              {task.status === 'running' && <span>预计剩余: {task.estimatedTime}</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ElinkStatus;