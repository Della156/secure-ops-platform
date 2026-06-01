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
        return <CheckCircle2 className="w-6 h-6 text-[#00C853]" />;
      case 'abnormal':
        return <AlertCircle className="w-6 h-6 text-[#FF9100]" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-[#FF3B30]" />;
      default:
        return <Clock className="w-6 h-6 text-[#9CA3AF]" />;
    }
  };

  // 获取状态样式
  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      abnormal: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
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
    if (time === 0) return 'text-[#6B7280]';
    if (time < 200) return 'text-[#00C853]';
    if (time < 500) return 'text-[#FF9100]';
    return 'text-[#FF3B30]';
  };

  // 获取当前任务的历史记录
  const getTaskHistory = (taskId: string) => {
    return historyData.filter(h => h.taskId === taskId);
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务接入状态管理</h1>
          <p className="text-[#9CA3AF]">实时监控任务接入状态和变更历史</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#2A354D] text-[#F3F4F6] rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '刷新中...' : '刷新状态'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#181F32] flex items-center justify-center">
                <Server className="w-5 h-5 text-[#9CA3AF]" />
              </div>
              <span className="text-[#9CA3AF] text-sm">任务总数</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#F3F4F6]">{stats.total}</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#00C853]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
              </div>
              <span className="text-[#9CA3AF] text-sm">正常</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#00C853]">{stats.normal}</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#FF9100]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#FF9100]" />
              </div>
              <span className="text-[#9CA3AF] text-sm">异常</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#FF9100]">{stats.abnormal}</p>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <span className="text-[#9CA3AF] text-sm">离线</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#FF3B30]">{stats.offline}</p>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索任务名称..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
            />
          </div>

          {/* 状态筛选 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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
            className={`bg-[#20293F] border rounded-xl p-5 transition-all hover:shadow-lg ${
              task.hasAlert ? 'border-red-500/50' : 'border-[#2A354D]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="text-[#F3F4F6] font-medium">{task.name}</h3>
                  <p className="text-[#6B7280] text-sm">{task.id}</p>
                </div>
              </div>
              {task.hasAlert && (
                <div className="flex items-center gap-1 text-[#FF3B30] text-sm">
                  <Bell className="w-4 h-4" />
                  <span>告警</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(task.status)}
              <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                <Wifi className="w-4 h-4" />
                <span>上次检查: {task.lastCheck}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
              <span className="text-[#6B7280]">响应时间</span>
              <p className={`font-medium ${getResponseTimeColor(task.responseTime)}`}>
                {task.responseTime > 0 ? `${task.responseTime}ms` : '-'}
              </p>
            </div>
            <div>
              <span className="text-[#6B7280]">可用性</span>
              <p className="text-[#F3F4F6] font-medium">{task.uptime}</p>
            </div>
          </div>

          <button
            onClick={() => handleViewHistory(task)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            变更历史
          </button>
        </div>
      ))}
    </div>

    {/* 状态变更历史 */}
    <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2A354D]">
        <h3 className="text-lg font-semibold text-[#F3F4F6]">状态变更历史</h3>
      </div>
      <div className="divide-y divide-[#2A354D]">
        {historyData.map((history) => (
          <div key={history.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(history.toStatus)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#F3F4F6] font-medium">{history.taskName}</span>
                    <span className="text-[#6B7280] text-sm">({history.taskId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={history.fromStatus === 'normal' ? 'text-[#00C853]' : history.fromStatus === 'abnormal' ? 'text-[#FF9100]' : 'text-[#FF3B30]'}>
                      {history.fromStatus === 'normal' ? '正常' : history.fromStatus === 'abnormal' ? '异常' : '离线'}
                    </span>
                    <span className="text-[#6B7280]">→</span>
                    <span className={history.toStatus === 'normal' ? 'text-[#00C853]' : history.toStatus === 'abnormal' ? 'text-[#FF9100]' : 'text-[#FF3B30]'}>
                      {history.toStatus === 'normal' ? '正常' : history.toStatus === 'abnormal' ? '异常' : '离线'}
                    </span>
                  </div>
                  {history.reason && (
                    <p className="text-[#9CA3AF] text-sm mt-1">{history.reason}</p>
                  )}
                </div>
              </div>
              <span className="text-[#6B7280] text-sm">{history.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 变更历史模态框 */}
    {isHistoryModalOpen && selectedTask && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">变更历史 - {selectedTask.name}</h3>
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6 p-4 bg-[#181F32]/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[#6B7280] text-sm">任务ID</span>
                  <p className="text-[#F3F4F6]">{selectedTask.id}</p>
                </div>
                <div>
                  <span className="text-[#6B7280] text-sm">当前状态</span>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B7280] text-sm">可用性</span>
                  <p className="text-[#F3F4F6]">{selectedTask.uptime}</p>
                </div>
                <div>
                  <span className="text-[#6B7280] text-sm">上次检查</span>
                  <p className="text-[#F3F4F6]">{selectedTask.lastCheck}</p>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-[#D1D5DB] mb-4">历史记录</h4>
            <div className="space-y-4">
              {getTaskHistory(selectedTask.id).map((history) => (
                <div key={history.id} className="flex items-start gap-4 p-4 bg-[#181F32]/30 rounded-lg">
                  <div className="mt-1">
                    {getStatusIcon(history.toStatus)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={history.fromStatus === 'normal' ? 'text-[#00C853]' : history.fromStatus === 'abnormal' ? 'text-[#FF9100]' : 'text-[#FF3B30]'}>
                          {history.fromStatus === 'normal' ? '正常' : history.fromStatus === 'abnormal' ? '异常' : '离线'}
                        </span>
                        <span className="text-[#6B7280]">→</span>
                        <span className={history.toStatus === 'normal' ? 'text-[#00C853]' : history.toStatus === 'abnormal' ? 'text-[#FF9100]' : 'text-[#FF3B30]'}>
                          {history.toStatus === 'normal' ? '正常' : history.toStatus === 'abnormal' ? '异常' : '离线'}
                        </span>
                      </div>
                      <span className="text-[#6B7280] text-sm">{history.time}</span>
                    </div>
                    {history.reason && (
                      <p className="text-[#9CA3AF] text-sm mt-2">{history.reason}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTaskHistory(selectedTask.id).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#6B7280]">暂无变更历史</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end p-4 border-t border-[#2A354D]">
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
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
