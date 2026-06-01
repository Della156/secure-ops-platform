'use client';

import React, { useState } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Clock, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedEndTime: string;
  timeout: number;
  priority: 'high' | 'medium' | 'low';
}

const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    name: '防火墙配置同步',
    status: 'running',
    progress: 65,
    startTime: '2026-06-01 10:30:00',
    estimatedEndTime: '2026-06-01 10:45:00',
    timeout: 1800,
    priority: 'high',
  },
  {
    id: 'TASK-002',
    name: '安全基线检查',
    status: 'paused',
    progress: 40,
    startTime: '2026-06-01 09:00:00',
    estimatedEndTime: '2026-06-01 10:00:00',
    timeout: 3600,
    priority: 'medium',
  },
  {
    id: 'TASK-003',
    name: '漏洞扫描任务',
    status: 'stopped',
    progress: 20,
    startTime: '2026-06-01 08:00:00',
    estimatedEndTime: '2026-06-01 09:00:00',
    timeout: 7200,
    priority: 'high',
  },
  {
    id: 'TASK-004',
    name: '日志分析任务',
    status: 'completed',
    progress: 100,
    startTime: '2026-06-01 06:00:00',
    estimatedEndTime: '2026-06-01 07:30:00',
    timeout: 5400,
    priority: 'low',
  },
];

export function RunControl() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task>(mockTasks[0]);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [newTimeout, setNewTimeout] = useState(selectedTask.timeout);

  const getStatusConfig = (status: string) => {
    const configs = {
      running: { label: '运行中', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Activity },
      paused: { label: '已暂停', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Pause },
      stopped: { label: '已停止', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      completed: { label: '已完成', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
      failed: { label: '失败', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle },
    };
    return configs[status as keyof typeof configs] || configs.stopped;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = { high: '高', medium: '中', low: '低' };
    return labels[priority as keyof typeof labels] || '中';
  };

  const formatTimeout = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}小时 ${minutes}分钟`;
    }
    return `${minutes}分钟 ${secs}秒`;
  };

  const handleStart = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'running' } : task
    ));
    if (selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'running' });
    }
  };

  const handlePause = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'paused' } : task
    ));
    if (selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'paused' });
    }
  };

  const handleStop = (taskId: string) => {
    if (confirm('确定要停止此任务吗？')) {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'stopped' } : task
      ));
      if (selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: 'stopped' });
      }
    }
  };

  const handleRetry = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'running', progress: 0 } : task
    ));
    if (selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'running', progress: 0 });
    }
  };

  const handleSaveTimeout = () => {
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? { ...task, timeout: newTimeout } : task
    ));
    setSelectedTask({ ...selectedTask, timeout: newTimeout });
    setShowTimeoutModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">任务运行控制</h1>
        <p className="text-slate-400">管理任务的启动、暂停、停止和重试操作</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/50">
              <h3 className="text-sm font-semibold text-white">任务列表</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {tasks.map(task => {
                const statusConfig = getStatusConfig(task.status);
                const Icon = statusConfig.icon;
                const isSelected = selectedTask.id === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-white text-sm">{task.name}</div>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig.color}`}>{statusConfig.label}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'failed' ? 'bg-red-500' :
                            task.status === 'running' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{task.id}</span>
                      <span className={`px-1.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTask.name}</h3>
                  <p className="text-sm text-slate-500">任务 ID: {selectedTask.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusConfig = getStatusConfig(selectedTask.status);
                    const Icon = statusConfig.icon;
                    return (
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        <Icon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {selectedTask.status === 'running' && (
                  <button
                    onClick={() => handlePause(selectedTask.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    暂停
                  </button>
                )}
                {(selectedTask.status === 'paused' || selectedTask.status === 'stopped' || selectedTask.status === 'failed') && (
                  <button
                    onClick={() => handleStart(selectedTask.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    继续
                  </button>
                )}
                {(selectedTask.status === 'running' || selectedTask.status === 'paused') && (
                  <button
                    onClick={() => handleStop(selectedTask.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    停止
                  </button>
                )}
                {(selectedTask.status === 'stopped' || selectedTask.status === 'failed' || selectedTask.status === 'completed') && (
                  <button
                    onClick={() => handleRetry(selectedTask.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重试
                  </button>
                )}
                <button
                  onClick={() => setShowTimeoutModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  超时设置
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    开始时间
                  </div>
                  <div className="text-white font-medium">{selectedTask.startTime}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    预计结束
                  </div>
                  <div className="text-white font-medium">{selectedTask.estimatedEndTime}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">超时设置</div>
                  <div className="text-white font-medium">{formatTimeout(selectedTask.timeout)}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">优先级</div>
                  <div className="text-white font-medium">{getPriorityLabel(selectedTask.priority)}优先级</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">执行进度</span>
                  <span className="text-lg font-bold text-white">{selectedTask.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      selectedTask.status === 'completed' ? 'bg-green-500' :
                      selectedTask.status === 'failed' ? 'bg-red-500' :
                      selectedTask.status === 'running' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTimeoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">超时设置</h3>
              <button
                onClick={() => setShowTimeoutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">超时时间（秒）</label>
              <input
                type="number"
                value={newTimeout}
                onChange={(e) => setNewTimeout(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">当前值: {formatTimeout(newTimeout)}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTimeoutModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTimeout}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
