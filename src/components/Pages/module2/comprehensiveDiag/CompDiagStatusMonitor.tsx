'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, Play, Pause, CheckCircle2,
  XCircle, Clock, Activity, AlertCircle, Server, Database, Network, Shield,
  Cpu, MemoryStick, BarChart3, Calendar, User, ListTree, Zap, ChevronRight,
  MoreVertical, Power
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface DiagTask {
  id: string;
  name: string;
  category: '网络' | '数据库' | '应用' | '存储' | '安全' | '硬件';
  status: 'running' | 'pending' | 'paused' | 'success' | 'failed' | 'queued';
  progress: number;
  startTime: string;
  duration: string;
  estimatedEnd: string;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  executor: string;
  relatedNodes: number;
  logsCount: number;
  errorCount: number;
  cpuUsage: number;
  memoryUsage: number;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
}

const tasks: DiagTask[] = [
  { id: 'CD-M-99821', name: '生产数据库连接池异常诊断', category: '数据库', status: 'running', progress: 65, startTime: '10:45:18', duration: '00:18:42', estimatedEnd: '11:15:00', currentStep: '分析连接池使用率', totalSteps: 8, completedSteps: 5, executor: '王芳', relatedNodes: 4, logsCount: 8420, errorCount: 0, cpuUsage: 72, memoryUsage: 68, priority: 'P0' },
  { id: 'CD-M-99820', name: 'Web 服务器 CPU 高负载诊断', category: '应用', status: 'running', progress: 42, startTime: '10:12:00', duration: '00:48:18', estimatedEnd: '11:30:00', currentStep: '分析线程栈', totalSteps: 6, completedSteps: 3, executor: '陈磊', relatedNodes: 2, logsCount: 12350, errorCount: 0, cpuUsage: 88, memoryUsage: 85, priority: 'P1' },
  { id: 'CD-M-99819', name: '存储 IO 延迟诊断', category: '存储', status: 'paused', progress: 38, startTime: '09:30:00', duration: '00:12:00', estimatedEnd: '11:00:00', currentStep: '分析控制器缓存', totalSteps: 5, completedSteps: 2, executor: '刘洋', relatedNodes: 3, logsCount: 2180, errorCount: 0, cpuUsage: 45, memoryUsage: 52, priority: 'P1' },
  { id: 'CD-M-99818', name: '网络抖动问题诊断', category: '网络', status: 'success', progress: 100, startTime: '08:30:00', duration: '00:45:00', estimatedEnd: '09:15:00', currentStep: '完成', totalSteps: 7, completedSteps: 7, executor: '李娜', relatedNodes: 5, logsCount: 5680, errorCount: 0, cpuUsage: 22, memoryUsage: 38, priority: 'P2' },
  { id: 'CD-M-99817', name: 'ActiveMQ 消息堆积诊断', category: '应用', status: 'queued', progress: 0, startTime: '--:--', duration: '--', estimatedEnd: '--:--', currentStep: '队列中', totalSteps: 4, completedSteps: 0, executor: '陈磊', relatedNodes: 3, logsCount: 0, errorCount: 0, cpuUsage: 0, memoryUsage: 0, priority: 'P1' },
  { id: 'CD-M-99816', name: '防火墙会话表满诊断', category: '安全', status: 'success', progress: 100, startTime: '16:30:00', duration: '00:45:00', estimatedEnd: '17:15:00', currentStep: '完成', totalSteps: 4, completedSteps: 4, executor: '李娜', relatedNodes: 1, logsCount: 3240, errorCount: 0, cpuUsage: 35, memoryUsage: 42, priority: 'P2' },
  { id: 'CD-M-99815', name: 'DNS 解析异常诊断', category: '网络', status: 'failed', progress: 56, startTime: '14:30:00', duration: '00:32:00', estimatedEnd: '15:15:00', currentStep: '从 DNS 服务器超时', totalSteps: 6, completedSteps: 3, executor: '李娜', relatedNodes: 2, logsCount: 4520, errorCount: 2, cpuUsage: 58, memoryUsage: 64, priority: 'P1' },
  { id: 'CD-M-99814', name: '硬件 RAID 控制器异常', category: '硬件', status: 'pending', progress: 0, startTime: '14:00:00', duration: '--', estimatedEnd: '15:00:00', currentStep: '准备开始', totalSteps: 5, completedSteps: 0, executor: '刘洋', relatedNodes: 1, logsCount: 0, errorCount: 0, cpuUsage: 0, memoryUsage: 0, priority: 'P2' },
];

const statusConfig = {
  running: { label: '运行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  pending: { label: '准备中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  success: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { label: '已失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  queued: { label: '队列中', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

const categoryColor: Record<DiagTask['category'], string> = {
  网络: '#06B6D4',
  数据库: '#22C55E',
  应用: '#FF6D00',
  存储: '#9333EA',
  安全: '#EF4444',
  硬件: '#EAB308',
};

const priorityColor: Record<DiagTask['priority'], string> = {
  P0: 'bg-red-500/20 text-red-400 border-red-500/40',
  P1: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  P2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  P3: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

const trendData = [
  { time: '08:00', running: 2, success: 1, failed: 0 },
  { time: '09:00', running: 3, success: 3, failed: 0 },
  { time: '10:00', running: 4, success: 5, failed: 1 },
  { time: '11:00', running: 2, success: 6, failed: 1 },
  { time: '12:00', running: 1, success: 7, failed: 1 },
];

export function CompDiagStatusMonitor() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('CD-M-99821');

  const filtered = tasks.filter(t => {
    if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const selected = selectedId ? tasks.find(t => t.id === selectedId) : null;
  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    success: tasks.filter(t => t.status === 'success').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="诊断任务" value={stats.total} color="#0066FF" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="运行中" value={stats.running} color="#22C55E" icon={<Play className="w-4 h-4" />} />
        <StatBox label="已成功" value={stats.success} color="#10B981" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">今日诊断任务趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="runningG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} /><stop offset="95%" stopColor="#0066FF" stopOpacity={0} /></linearGradient>
              <linearGradient id="successG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
              <linearGradient id="failedG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Area type="monotone" dataKey="running" stroke="#0066FF" fill="url(#runningG)" name="运行中" />
            <Area type="monotone" dataKey="success" stroke="#22C55E" fill="url(#successG)" name="已成功" />
            <Area type="monotone" dataKey="failed" stroke="#EF4444" fill="url(#failedG)" name="已失败" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断任务状态监控</h2>
            <p className="text-xs text-slate-500 mt-1">实时监控所有综合故障诊断任务执行进度 / 资源 / 异常</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索任务/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="running">运行中</option>
            <option value="pending">准备中</option>
            <option value="paused">已暂停</option>
            <option value="success">已完成</option>
            <option value="failed">已失败</option>
            <option value="queued">队列中</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类别</option>
            <option value="网络">网络</option>
            <option value="数据库">数据库</option>
            <option value="应用">应用</option>
            <option value="存储">存储</option>
            <option value="安全">安全</option>
            <option value="硬件">硬件</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 任务列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">任务列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(t => {
              const sc = statusConfig[t.status as keyof typeof statusConfig];
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === t.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{t.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${priorityColor[t.priority]}`}>{t.priority}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[t.category]}20`, color: categoryColor[t.category] }}>{t.category}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{t.startTime} ~ {t.estimatedEnd}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1.5">{t.name}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-1.5">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{t.executor}</span>
                    <span>·</span>
                    <span>节点 {t.relatedNodes}</span>
                    <span>·</span>
                    <span>日志 {t.logsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${t.status === 'failed' ? 'bg-red-500' : t.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${t.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono shrink-0">{t.completedSteps}/{t.totalSteps} · {t.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详情 */}
        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${priorityColor[selected.priority]}`}>{selected.priority}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>{selected.category}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div className="bg-[#111625] border border-blue-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">当前步骤</div>
              <div className="text-xs text-blue-300">{selected.currentStep}</div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">执行进度</span>
                <span className="font-mono text-blue-300">{selected.progress}%</span>
              </div>
              <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.status === 'failed' ? 'bg-red-500' : selected.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${selected.progress}%` }} />
              </div>
            </div>

            {selected.status === 'running' && (
              <div>
                <div className="text-xs text-slate-500 mb-2">资源占用</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-[#111625] rounded p-1.5">
                    <div className="text-[9px] text-slate-500">CPU</div>
                    <div className="text-sm font-semibold text-blue-300">{selected.cpuUsage}%</div>
                  </div>
                  <div className="bg-[#111625] rounded p-1.5">
                    <div className="text-[9px] text-slate-500">内存</div>
                    <div className="text-sm font-semibold text-purple-300">{selected.memoryUsage}%</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">关联节点</div>
                <div className="text-slate-200 font-mono">{selected.relatedNodes}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">日志条数</div>
                <div className="text-slate-200 font-mono">{selected.logsCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-2">
              {selected.status === 'running' ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                    <Pause className="w-3 h-3" />暂停
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                    <XCircle className="w-3 h-3" />中止
                  </button>
                </>
              ) : selected.status === 'queued' ? (
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" />立即执行
                </button>
              ) : (
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Eye className="w-3 h-3" />查看详情
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default CompDiagStatusMonitor;
