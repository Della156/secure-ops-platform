'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Play, Pause, RotateCcw, CheckCircle2,
  XCircle, AlertCircle, Clock, Activity, TrendingUp,
  Filter, Search, ChevronDown, MoreHorizontal, Eye,
  RefreshCw, Download, Plus, Calendar
} from 'lucide-react';

interface RunningTask {
  id: string;
  name: string;
  category: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  duration: string;
  executor: string;
  targetAsset: string;
}

interface TaskCategory {
  name: string;
  count: number;
  color: string;
}

const mockRunningTasks: RunningTask[] = [
  { id: 'RUN-001', name: '安全策略巡检任务', category: '巡检', status: 'running', progress: 78, startTime: '2026-06-02 16:30:00', duration: '25 分钟', executor: 'system', targetAsset: '全部设备' },
  { id: 'RUN-002', name: '漏洞扫描任务', category: '扫描', status: 'running', progress: 45, startTime: '2026-06-02 16:45:00', duration: '18 分钟', executor: 'admin', targetAsset: 'WEB 服务器组' },
  { id: 'RUN-003', name: '日志备份', category: '备份', status: 'completed', progress: 100, startTime: '2026-06-02 15:00:00', duration: '45 分钟', executor: 'system', targetAsset: '日志服务器' },
  { id: 'RUN-004', name: '基线检查', category: '合规', status: 'failed', progress: 67, startTime: '2026-06-02 14:30:00', duration: '32 分钟', executor: 'admin', targetAsset: '数据库集群' },
  { id: 'RUN-005', name: '告警聚合分析', category: '分析', status: 'running', progress: 92, startTime: '2026-06-02 16:50:00', duration: '5 分钟', executor: 'system', targetAsset: 'SIEM 系统' },
  { id: 'RUN-006', name: '威胁情报同步', category: '同步', status: 'pending', progress: 0, startTime: '2026-06-02 17:00:00', duration: '-', executor: 'system', targetAsset: '威胁情报平台' },
];

const mockCategories: TaskCategory[] = [
  { name: '巡检', count: 23, color: '#3B82F6' },
  { name: '扫描', count: 15, color: '#EF4444' },
  { name: '备份', count: 8, color: '#10B981' },
  { name: '合规', count: 12, color: '#F59E0B' },
  { name: '分析', count: 34, color: '#8B5CF6' },
  { name: '同步', count: 6, color: '#06B6D4' },
];

function StatusBadge({ status }: { status: RunningTask['status'] }) {
  const config = {
    running: { bg: 'bg-green-500/10', text: 'text-green-400', label: '运行中', icon: <Activity className="w-3 h-3" /> },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '已完成', icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400', label: '失败', icon: <XCircle className="w-3 h-3" /> },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '等待中', icon: <Clock className="w-3 h-3" /> },
  };
  const { bg, text, label, icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {icon}
      {label}
    </span>
  );
}

function CategoryDonut({ categories }: { categories: TaskCategory[] }) {
  const total = categories.reduce((acc, c) => acc + c.count, 0);
  let currentAngle = 0;

  return (
    <svg width="160" height="160" className="transform -rotate-90">
      {categories.map((cat, i) => {
        const angle = (cat.count / total) * 360;
        const startAngle = (currentAngle * Math.PI) / 180;
        const endAngle = ((currentAngle + angle) * Math.PI) / 180;
        currentAngle += angle;

        const x1 = 80 + 60 * Math.cos(startAngle);
        const y1 = 80 + 60 * Math.sin(startAngle);
        const x2 = 80 + 60 * Math.cos(endAngle);
        const y2 = 80 + 60 * Math.sin(endAngle);
        const largeArc = angle > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M 80 80 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={cat.color}
            opacity={0.8}
          />
        );
      })}
      <circle cx="80" cy="80" r="35" fill="#0F172A" />
    </svg>
  );
}

export function TaskRunDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<RunningTask | null>(null);

  const filteredTasks = useMemo(() => {
    return mockRunningTasks.filter(task => {
      const matchSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = mockRunningTasks.length;
    const running = mockRunningTasks.filter(t => t.status === 'running').length;
    const completed = mockRunningTasks.filter(t => t.status === 'completed').length;
    const failed = mockRunningTasks.filter(t => t.status === 'failed').length;
    return { total, running, completed, failed };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-purple-400" />
            自动任务运行可视化仪表盘
          </h2>
          <p className="text-sm text-gray-400 mt-1">实时监控和管理自动化任务的运行状态</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新建任务
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '任务总数', value: stats.total, color: 'blue', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: '运行中', value: stats.running, color: 'green', icon: <Play className="w-4 h-4" /> },
          { label: '已完成', value: stats.completed, color: 'blue', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '失败', value: stats.failed, color: 'red', icon: <XCircle className="w-4 h-4" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-[#20293F] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
                >
                  <option value="all">全部状态</option>
                  <option value="running">运行中</option>
                  <option value="completed">已完成</option>
                  <option value="failed">失败</option>
                  <option value="pending">等待中</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 hover:bg-[#111625] cursor-pointer transition-colors ${selectedTask?.id === task.id ? 'bg-blue-500/10' : ''}`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.status === 'running' ? 'bg-green-500/20' :
                      task.status === 'completed' ? 'bg-blue-500/20' :
                      task.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {task.status === 'running' && <Activity className="w-5 h-5 text-green-400" />}
                      {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                      {task.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                      {task.status === 'pending' && <Clock className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{task.name}</span>
                        <span className="text-xs text-gray-500 font-mono">{task.id}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{task.category}</span>
                        <span>{task.targetAsset}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={task.status} />
                    <div className="text-xs text-gray-500 mt-1">{task.duration}</div>
                  </div>
                </div>
                {task.status === 'running' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>进度</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
            <span className="text-xs text-gray-500">共 {filteredTasks.length} 条记录</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
              <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
              <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">任务类别分布</h3>
            <div className="flex justify-center">
              <CategoryDonut categories={mockCategories} />
            </div>
            <div className="mt-3 space-y-2">
              {mockCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-400">{cat.name}</span>
                  </div>
                  <span className="text-white">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">快速操作</h3>
            <div className="space-y-2">
              {[
                { label: '暂停所有任务', icon: <Pause className="w-4 h-4" />, color: 'yellow' },
                { label: '重试失败任务', icon: <RotateCcw className="w-4 h-4" />, color: 'blue' },
                { label: '查看任务日志', icon: <Eye className="w-4 h-4" />, color: 'green' },
                { label: '导出任务报告', icon: <Download className="w-4 h-4" />, color: 'purple' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-2 p-2 rounded bg-[#111625] hover:bg-[#20293F] text-sm text-gray-300 transition-colors"
                >
                  <span className={`text-${action.color}-400`}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {selectedTask && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                任务详情
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">任务ID</span>
                  <span className="text-white font-mono">{selectedTask.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">任务名称</span>
                  <span className="text-white">{selectedTask.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">执行器</span>
                  <span className="text-white">{selectedTask.executor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">目标资产</span>
                  <span className="text-white">{selectedTask.targetAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">开始时间</span>
                  <span className="text-white">{selectedTask.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">状态</span>
                  <StatusBadge status={selectedTask.status} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskRunDashboard;