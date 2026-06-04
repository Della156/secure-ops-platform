'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Pause, Play, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockTasks = [
  { id: 'AD-001', name: '告警分析决策任务A', status: 'running', progress: 75, duration: '2小时30分', lastUpdate: '2分钟前', pendingDecisions: 12 },
  { id: 'AD-002', name: '告警分析决策任务B', status: 'running', progress: 45, duration: '1小时15分', lastUpdate: '5分钟前', pendingDecisions: 5 },
  { id: 'AD-003', name: '告警分析决策任务C', status: 'completed', progress: 100, duration: '4小时', lastUpdate: '1小时前', pendingDecisions: 0 },
  { id: 'AD-004', name: '告警分析决策任务D', status: 'running', progress: 60, duration: '3小时', lastUpdate: '1分钟前', pendingDecisions: 8 },
  { id: 'AD-005', name: '告警分析决策任务E', status: 'failed', progress: 30, duration: '30分钟', lastUpdate: '30分钟前', pendingDecisions: 23 },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'failed': return '失败';
    default: return status;
  }
};

const getActivityColor = (status: string) =>
  status === 'running' ? 'text-green-400 animate-pulse' :
  status === 'failed' ? 'text-red-400' : 'text-blue-400';

export function AlertDecisionStatus() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 2, 100);
          return { ...task, progress: Math.round(newProgress) };
        }
        return task;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setTasks(mockTasks.map(task => ({ ...task, progress: task.status === 'running' ? Math.min(task.progress + Math.random() * 5, 100) : task.progress })));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">告警分析决策任务状态监控</h1>
          <p className="text-slate-400 mt-1">实时监控决策任务状态与分析进度</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? '自动刷新中' : '开启自动刷新'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />手动刷新
          </Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">任务状态监控</h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className={`bg-slate-800/50 rounded-lg p-4 ${task.status === 'failed' ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className={`w-5 h-5 mr-3 ${getActivityColor(task.status)}`} />
                    <div>
                      <p className="text-slate-50 font-medium">{task.name}</p>
                      <p className="text-slate-500 text-sm">任务ID: {task.id} | 运行时长: {task.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    {task.pendingDecisions > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border bg-orange-500/20 text-orange-400 border-orange-500/40">
                        {task.pendingDecisions} 待决策
                      </span>
                    )}
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    {task.status === 'running' && <Button variant="ghost" size="sm"><Pause className="w-4 h-4" /></Button>}
                    {task.status === 'failed' && <Button variant="ghost" size="sm" className="text-green-400"><Play className="w-4 h-4" /></Button>}
                  </div>
                </div>
                {task.status !== 'completed' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">分析进度</span>
                      <span className="text-slate-300">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${task.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                )}
                <p className="text-slate-500 text-xs mt-2">最后更新: {task.lastUpdate}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AlertDecisionStatus;
