'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Clock, CheckCircle2, AlertCircle, XCircle, Activity, Server, Wifi, Bell, Eye, X } from 'lucide-react';

// 状态变更历史类型
interface StatusHistory {
  id: string;
  taskId: string;
  taskName: string;
  fromStatus: string;
  toStatus: string;
  time: string;
  reason?: string;
}

// 任务接入状态类型
interface TaskStatus {
  id: string;
  name: string;
  status: 'normal' | 'abnormal' | 'offline';
  lastCheck: string;
  responseTime: number;
  uptime: string;
  hasAlert: boolean;
}

// 模拟任务状态数据
const mockTaskData: TaskStatus[] = [
  { id: 'TASK-001', name: '防火墙配置同步任务', status: 'normal', lastCheck: '2026-06-01 15:30:00', responseTime: 45, uptime: '99.8%', hasAlert: false },
  { id: 'TASK-002', name: 'IDS日志采集任务', status: 'normal', lastCheck: '2026-06-01 15:30:00', responseTime: 120, uptime: '99.5%', hasAlert: false },
  { id: 'TASK-003', name: '网络设备监控', status: 'abnormal', lastCheck: '2026-06-01 15:28:00', responseTime: 800, uptime: '95.2%', hasAlert: true },
  { id: 'TASK-004', name: '数据库备份任务', status: 'offline', lastCheck: '2026-06-01 14:00:00', responseTime: 0, uptime: '88.3%', hasAlert: true },
  { id: 'TASK-005', name: 'Web应用安全扫描', status: 'normal', lastCheck: '2026-06-01 15:30:00', responseTime: 230, uptime: '99.2%', hasAlert: false },
];

// 模拟状态变更历史数据
const mockHistoryData: StatusHistory[] = [
  { id: 'HIST-001', taskId: 'TASK-003', taskName: '网络设备监控', fromStatus: 'normal', toStatus: 'abnormal', time: '2026-06-01 15:28:00', reason: '响应超时（> 500ms)' },
  { id: 'HIST-002', taskId: 'TASK-004', taskName: '数据库备份任务', fromStatus: 'abnormal', toStatus: 'offline', time: '2026-06-01 14:00:00', reason: '连接失败' },
  { id: 'HIST-003', taskId: 'TASK-004', taskName: '数据库备份任务', fromStatus: 'normal', toStatus: 'abnormal', time: '2026-06-01 12:30:00', reason: '响应时间波动' },
  { id: 'HIST-004', taskId: 'TASK-001', taskName: '防火墙配置同步任务', fromStatus: 'abnormal', toStatus: 'normal', time: '2026-05-31 10:00:00', reason: '网络恢复' },
  { id: 'HIST-005', taskId: 'TASK-002', taskName: 'IDS日志采集任务', fromStatus: 'normal', toStatus: 'normal', time: '2026-05-31 08:00:00', reason: '定期检查' },
];

export function TaskAccessStatus() {
  const [taskData, setTaskData] = useState<TaskStatus[]>(mockTaskData);
  const [historyData, setHistoryData] = useState<StatusHistory[]>(mockHistoryData);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskStatus | null>(null);

  // 统计数据
  const stats = {
    total: taskData.length,
    normal: taskData.filter(t => t.status === 'normal').length,
    abnormal: taskData.filter(t => t.status === 'abnormal').length,
    offline: taskData.filter(t => t.status === 'offline').length,
  };

  // 过滤任务数据
  const filteredTaskData = taskData.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchName && matchStatus;
  });

  // 手动刷新状态
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // 模拟刷新后的数据更新
      setTaskData(taskData.map(task => ({
        ...task,
        lastCheck: new Date().toLocaleString('zh-CN'),
      })));
    }, 1000);
  };

  // 查看变更历史
  const handleViewHistory = (task: TaskStatus) => {
    setSelectedTask(task);
    setIsHistoryModalOpen(true);
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'abnormal':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-slate-400" />;
    }
  };

  // 获取状态样式
  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-500/20 text-green-400 border-green-500/30',
      abnormal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels = {
      normal: '正常',
      abnormal: '异常',
      offline: '离线',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 获取响应时间样式
  const getResponseTimeColor = (time: number) => {
    if (time === 0) return 'text-slate-500';
    if (time < 200) return 'text-green-400';
    if (time < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  // 获取当前任务的历史记录
  const getTaskHistory = (taskId: string) => {
    return historyData.filter(h => h.taskId === taskId);
  };

  return (
    <div className="p-8">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">任务接入状态管理</h1>
          <p className="text-slate-400">实时监控任务接入状态和变更历史</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '刷新中...' : '刷新状态'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <Server className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-slate-400 text-sm">任务总数</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">正常</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.normal}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-slate-400 text-sm">异常</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{stats.abnormal}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-slate-400 text-sm">离线</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.offline}</p>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索任务名称..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* 状态筛选 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="normal">正常</option>
            <option value="abnormal">异常</option>
            <option value="offline">离线</option>
          </select>
        </div>
      </div>

      {/* 任务状态卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredTaskData.map((task) => (
          <div
            key={task.id}
            className={`bg-slate-900 border rounded-xl p-5 transition-all hover:shadow-lg ${
              task.hasAlert ? 'border-red-500/50' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="text-white font-medium">{task.name}</h3>
                  <p className="text-slate-500 text-sm">{task.id}</p>
                </div>
              </div>
              {task.hasAlert && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <Bell className="w-4 h-4" />
                  <span>告警</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(task.status)}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Wifi className="w-4 h-4" />
                <span>上次检查: {task.lastCheck}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
              <span className="text-slate-500">响应时间</span>
              <p className={`font-medium ${getResponseTimeColor(task.responseTime)}`}>
                {task.responseTime > 0 ? `${task.responseTime}ms` : '-'}
              </p>
            </div>
            <div>
              <span className="text-slate-500">可用性</span>
              <p className="text-white font-medium">{task.uptime}</p>
            </div>
          </div>

          <button
            onClick={() => handleViewHistory(task)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            变更历史
          </button>
        </div>
      ))}
    </div>

    {/* 状态变更历史 */}
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">状态变更历史</h3>
      </div>
      <div className="divide-y divide-slate-800">
        {historyData.map((history) => (
          <div key={history.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(history.toStatus)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{history.taskName}</span>
                    <span className="text-slate-500 text-sm">({history.taskId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={history.fromStatus === 'normal' ? 'text-green-400' : history.fromStatus === 'abnormal' ? 'text-yellow-400' : 'text-red-400'}>
                      {history.fromStatus === 'normal' ? '正常' : history.fromStatus === 'abnormal' ? '异常' : '离线'}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className={history.toStatus === 'normal' ? 'text-green-400' : history.toStatus === 'abnormal' ? 'text-yellow-400' : 'text-red-400'}>
                      {history.toStatus === 'normal' ? '正常' : history.toStatus === 'abnormal' ? '异常' : '离线'}
                    </span>
                  </div>
                  {history.reason && (
                    <p className="text-slate-400 text-sm mt-1">{history.reason}</p>
                  )}
                </div>
              </div>
              <span className="text-slate-500 text-sm">{history.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 变更历史模态框 */}
    {isHistoryModalOpen && selectedTask && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">变更历史 - {selectedTask.name}</h3>
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-slate-500 text-sm">任务ID</span>
                  <p className="text-white">{selectedTask.id}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">当前状态</span>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-sm">可用性</span>
                  <p className="text-white">{selectedTask.uptime}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">上次检查</span>
                  <p className="text-white">{selectedTask.lastCheck}</p>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-slate-300 mb-4">历史记录</h4>
            <div className="space-y-4">
              {getTaskHistory(selectedTask.id).map((history) => (
                <div key={history.id} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="mt-1">
                    {getStatusIcon(history.toStatus)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={history.fromStatus === 'normal' ? 'text-green-400' : history.fromStatus === 'abnormal' ? 'text-yellow-400' : 'text-red-400'}>
                          {history.fromStatus === 'normal' ? '正常' : history.fromStatus === 'abnormal' ? '异常' : '离线'}
                        </span>
                        <span className="text-slate-500">→</span>
                        <span className={history.toStatus === 'normal' ? 'text-green-400' : history.toStatus === 'abnormal' ? 'text-yellow-400' : 'text-red-400'}>
                          {history.toStatus === 'normal' ? '正常' : history.toStatus === 'abnormal' ? '异常' : '离线'}
                        </span>
                      </div>
                      <span className="text-slate-500 text-sm">{history.time}</span>
                    </div>
                    {history.reason && (
                      <p className="text-slate-400 text-sm mt-2">{history.reason}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTaskHistory(selectedTask.id).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500">暂无变更历史</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end p-4 border-t border-slate-800">
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
