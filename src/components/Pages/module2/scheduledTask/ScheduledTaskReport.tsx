'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Edit, Pause, Play,
  Clock, CheckCircle2, XCircle, AlertCircle, Activity, Server, Database,
  Network, Calendar, User, TrendingUp, Cpu, HardDrive, Zap, Shield,
  ChevronRight, MoreVertical, Power, ListTree, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

interface DrillTask {
  id: string;
  name: string;
  scenario: string;
  target: string;
  status: 'running' | 'pending' | 'paused' | 'success' | 'failed' | 'scheduled';
  progress: number; // 0-100
  startTime: string;
  estimatedEnd: string;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  executor: string;
  duration: string;
  cpu: number;
  memory: number;
  networkIO: number;
  logsCount: number;
  errorCount: number;
  warningCount: number;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
}

const tasks: DrillTask[] = [
  { id: 'DT-99821', name: '金融核心系统灾备切换', scenario: '全链路灾备', target: 'fin-core-cluster', status: 'running', progress: 65, startTime: '10:35:00', estimatedEnd: '12:08:00', currentStep: '应用切换 → 灾备中心', totalSteps: 18, completedSteps: 12, executor: '张伟', duration: '00:52:18', cpu: 68, memory: 72, networkIO: 850, logsCount: 8420, errorCount: 0, warningCount: 3, priority: 'P0' },
  { id: 'DT-99820', name: 'Oracle RPO/RTO 验证', scenario: '数据库灾备', target: 'oracle-prod', status: 'running', progress: 42, startTime: '10:48:00', estimatedEnd: '12:30:00', currentStep: 'RECOVER DATABASE', totalSteps: 24, completedSteps: 10, executor: '王芳', duration: '01:24:50', cpu: 85, memory: 91, networkIO: 320, logsCount: 12350, errorCount: 0, warningCount: 8, priority: 'P0' },
  { id: 'DT-99819', name: 'Web 集群自动伸缩测试', scenario: '应用灾备', target: 'web-cluster-prod', status: 'paused', progress: 38, startTime: '10:12:00', estimatedEnd: '11:00:00', currentStep: '节点 5/8 健康检查', totalSteps: 8, completedSteps: 3, executor: '陈磊', duration: '00:18:00', cpu: 45, memory: 52, networkIO: 110, logsCount: 2180, errorCount: 0, warningCount: 1, priority: 'P2' },
  { id: 'DT-99818', name: '域控制器 AD 故障切换', scenario: '单系统灾备', target: 'dc-01/dc-02', status: 'success', progress: 100, startTime: '09:00:00', estimatedEnd: '09:42:00', currentStep: '完成', totalSteps: 16, completedSteps: 16, executor: '刘洋', duration: '00:42:00', cpu: 22, memory: 38, networkIO: 45, logsCount: 5680, errorCount: 0, warningCount: 0, priority: 'P1' },
  { id: 'DT-99817', name: '财务数据恢复演练', scenario: '应用灾备', target: 'finance-db', status: 'running', progress: 78, startTime: '02:00:00', estimatedEnd: '04:25:00', currentStep: '业务验证', totalSteps: 14, completedSteps: 11, executor: '王芳', duration: '02:08:00', cpu: 72, memory: 78, networkIO: 240, logsCount: 15820, errorCount: 0, warningCount: 2, priority: 'P0' },
  { id: 'DT-99816', name: '防火墙 HA 切换', scenario: '网络灾备', target: 'fw-core-01/02', status: 'success', progress: 100, startTime: '16:00:00', estimatedEnd: '16:18:00', currentStep: '完成', totalSteps: 10, completedSteps: 10, executor: '李娜', duration: '00:18:00', cpu: 35, memory: 42, networkIO: 120, logsCount: 3240, errorCount: 0, warningCount: 0, priority: 'P1' },
  { id: 'DT-99815', name: 'DNS 故障切换演练', scenario: '网络灾备', target: 'dns-cluster', status: 'failed', progress: 56, startTime: '14:30:00', estimatedEnd: '15:15:00', currentStep: '从 DNS 服务器超时', totalSteps: 12, completedSteps: 7, executor: '李娜', duration: '00:32:00', cpu: 58, memory: 64, networkIO: 80, logsCount: 4520, errorCount: 2, warningCount: 5, priority: 'P1' },
  { id: 'DT-99814', name: '邮件系统灾备验证', scenario: '应用灾备', target: 'mail-prod', status: 'scheduled', progress: 0, startTime: '23:00:00', estimatedEnd: '23:45:00', currentStep: '等待开始', totalSteps: 12, completedSteps: 0, executor: '陈磊', duration: '00:00:00', cpu: 0, memory: 0, networkIO: 0, logsCount: 0, errorCount: 0, warningCount: 0, priority: 'P2' },
];

const statusConfig = {
  running: { label: '运行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  pending: { label: '等待中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  success: { label: '已成功', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { label: '已失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  scheduled: { label: '已计划', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

const priorityColor: Record<DrillTask['priority'], string> = {
  P0: 'bg-red-500/20 text-red-400 border-red-500/40',
  P1: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  P2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  P3: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

// 趋势
const trendData = [
  { time: '08:00', running: 2, success: 1, failed: 0 },
  { time: '09:00', running: 3, success: 2, failed: 0 },
  { time: '10:00', running: 5, success: 3, failed: 1 },
  { time: '11:00', running: 4, success: 5, failed: 1 },
  { time: '12:00', running: 3, success: 6, failed: 1 },
];

export function ScheduledTaskReport() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('DT-99821');

  const filtered = tasks.filter(t => {
    if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
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
        <StatBox label="演练任务" value={stats.total} color="#0066FF" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="运行中" value={stats.running} color="#22C55E" icon={<Play className="w-4 h-4" />} />
        <StatBox label="已成功" value={stats.success} color="#10B981" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      {/* 趋势 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" />今日演练任务趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="running" stackId="a" fill="#0066FF" name="运行中" />
            <Bar dataKey="success" stackId="a" fill="#22C55E" name="已成功" />
            <Bar dataKey="failed" stackId="a" fill="#EF4444" name="已失败" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">演练任务状态监控</h2>
            <p className="text-xs text-slate-500 mt-1">实时监控所有演练任务执行进度 / 资源占用 / 日志 / 异常</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建任务
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            <option value="pending">等待中</option>
            <option value="paused">已暂停</option>
            <option value="success">已成功</option>
            <option value="failed">已失败</option>
            <option value="scheduled">已计划</option>
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
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{t.startTime} ~ {t.estimatedEnd}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1.5">{t.name}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-1.5">
                    <span>场景 <span className="text-blue-300">{t.scenario}</span></span>
                    <span>·</span>
                    <span>目标 <span className="text-yellow-300 font-mono">{t.target}</span></span>
                    <span>·</span>
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{t.executor}</span>
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${priorityColor[selected.priority]}`}>{selected.priority}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div className="bg-[#111625] border border-blue-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">当前步骤</div>
              <div className="text-xs text-blue-300">{selected.currentStep}</div>
            </div>

            {/* 进度 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">执行进度</span>
                <span className="font-mono text-blue-300">{selected.progress}%</span>
              </div>
              <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.status === 'failed' ? 'bg-red-500' : selected.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${selected.progress}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{selected.completedSteps} / {selected.totalSteps} 步骤</div>
            </div>

            {/* 资源占用 */}
            {selected.status === 'running' && (
              <div>
                <div className="text-xs text-slate-500 mb-2">资源占用</div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <ResourceGauge label="CPU" value={selected.cpu} unit="%" color="#0066FF" />
                  <ResourceGauge label="内存" value={selected.memory} unit="%" color="#9333EA" />
                  <ResourceGauge label="网络" value={selected.networkIO} unit="MB" color="#22C55E" max={1000} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">预计完成</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.estimatedEnd}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">运行时长</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">日志条数</div>
                <div className="text-slate-200 font-mono">{selected.logsCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">告警</div>
                <div className="text-lg font-bold text-yellow-400">{selected.warningCount}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">错误</div>
                <div className="text-lg font-bold text-red-400">{selected.errorCount}</div>
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
              ) : selected.status === 'paused' ? (
                <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" />恢复
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

function ResourceGauge({ label, value, unit, color, max = 100 }: { label: string; value: number; unit: string; color: string; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="bg-[#111625] rounded p-1.5">
      <div className="text-[9px] text-slate-500">{label}</div>
      <div className="text-sm font-semibold" style={{ color }}>{value}{unit}</div>
      <div className="h-1 bg-[#20293F] rounded-full overflow-hidden mt-1">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default ScheduledTaskReport;
