'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Filter, Eye, Play, Pause, CheckCircle2, XCircle, Clock, Activity, User, FileText, AlertCircle, BarChart3, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AssistantTask {
  id: string; name: string; jobType: string; status: 'running' | 'pending' | 'paused' | 'success' | 'failed' | 'queued';
  progress: number; startTime: string; duration: string; estimatedEnd: string;
  currentStep: string; totalSteps: number; completedSteps: number; executor: string;
  aiSuggestions: number; appliedSuggestions: number; qualityScore: number;
}

const tasks: AssistantTask[] = [
  { id: 'JAM-99821', name: '生产防火墙策略变更辅助', jobType: '配置变更', status: 'running', progress: 65, startTime: '11:25:00', duration: '00:18:42', estimatedEnd: '12:00:00', currentStep: 'AI 质量评分', totalSteps: 6, completedSteps: 4, executor: 'AI 智能', aiSuggestions: 8, appliedSuggestions: 0, qualityScore: 78 },
  { id: 'JAM-99820', name: 'Oracle 表结构变更辅助', jobType: '数据操作', status: 'running', progress: 42, startTime: '10:48:18', duration: '00:24:18', estimatedEnd: '12:00:00', currentStep: 'AI 风险识别', totalSteps: 8, completedSteps: 3, executor: 'AI 智能', aiSuggestions: 12, appliedSuggestions: 0, qualityScore: 85 },
  { id: 'JAM-99819', name: 'Web 集群补丁安装辅助', jobType: '漏洞修复', status: 'success', progress: 100, startTime: '09:32:00', duration: '00:43:00', estimatedEnd: '10:15:00', currentStep: '完成', totalSteps: 5, completedSteps: 5, executor: 'AI 智能', aiSuggestions: 10, appliedSuggestions: 8, qualityScore: 82 },
  { id: 'JAM-99818', name: 'AD 域账号权限调整辅助', jobType: '配置变更', status: 'success', progress: 100, startTime: '08:15:00', duration: '00:18:00', estimatedEnd: '08:33:00', currentStep: '完成', totalSteps: 4, completedSteps: 4, executor: 'AI 智能', aiSuggestions: 6, appliedSuggestions: 6, qualityScore: 90 },
  { id: 'JAM-99817', name: '生产慢 SQL 优化辅助', jobType: '日常维护', status: 'failed', progress: 56, startTime: '22:48:00', duration: '00:32:00', estimatedEnd: '23:20:00', currentStep: '失败', totalSteps: 6, completedSteps: 3, executor: 'AI 智能', aiSuggestions: 8, appliedSuggestions: 0, qualityScore: 42 },
  { id: 'JAM-99816', name: 'APT 应急处置辅助', jobType: '应急处置', status: 'success', progress: 100, startTime: '18:30:00', duration: '00:08:00', estimatedEnd: '18:38:00', currentStep: '完成', totalSteps: 3, completedSteps: 3, executor: 'AI 紧急', aiSuggestions: 15, appliedSuggestions: 14, qualityScore: 95 },
  { id: 'JAM-99815', name: 'Redis 集群重启辅助', jobType: '日常维护', status: 'queued', progress: 0, startTime: '--:--', duration: '--', estimatedEnd: '--:--', currentStep: '队列中', totalSteps: 3, completedSteps: 0, executor: 'AI 智能', aiSuggestions: 0, appliedSuggestions: 0, qualityScore: 0 },
];

const statusConfig = {
  running: { label: '运行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  pending: { label: '准备中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  success: { label: '已成功', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { label: '已失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  queued: { label: '队列中', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

const jobTypeColor: Record<string, string> = {
  '配置变更': '#EAB308', '数据操作': '#22C55E', '漏洞修复': '#FF6D00',
  '应急处置': '#EF4444', '日常维护': '#0066FF', '安全加固': '#9333EA',
};

const trend = [
  { time: '08:00', running: 2, success: 1, failed: 0 },
  { time: '10:00', running: 3, success: 4, failed: 0 },
  { time: '12:00', running: 2, success: 6, failed: 1 },
  { time: '14:00', running: 1, success: 8, failed: 1 },
];

export function JobAssistantStatusMonitor() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('JAM-99821');

  const filtered = tasks.filter(t => {
    if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? tasks.find(t => t.id === selectedId) : null;
  const stats = {
    total: tasks.length, running: tasks.filter(t => t.status === 'running').length,
    success: tasks.filter(t => t.status === 'success').length, failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="辅助任务" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="运行中" value={stats.running} color="#22C55E" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="已成功" value={stats.success} color="#10B981" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="已失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">今日辅助任务趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="j1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} /><stop offset="95%" stopColor="#0066FF" stopOpacity={0} /></linearGradient>
              <linearGradient id="j2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Area type="monotone" dataKey="running" stroke="#0066FF" fill="url(#j1)" name="运行中" />
            <Area type="monotone" dataKey="success" stroke="#22C55E" fill="url(#j2)" name="已成功" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">作业综合辅助任务状态监控</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索任务/ID" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="running">运行中</option><option value="paused">已暂停</option>
            <option value="success">已成功</option><option value="failed">已失败</option><option value="queued">队列中</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">任务列表 ({filtered.length})</h3></div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(t => {
              const sc = statusConfig[t.status];
              return (
                <div key={t.id} onClick={() => setSelectedId(t.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === t.id ? 'bg-[#111625]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{t.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[t.jobType] || '#0066FF'}20`, color: jobTypeColor[t.jobType] || '#0066FF' }}>{t.jobType}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div className="flex-1" />
                    {t.qualityScore > 0 && <span className={`text-[10px] font-mono ${t.qualityScore >= 90 ? 'text-green-400' : t.qualityScore >= 70 ? 'text-orange-400' : 'text-red-400'}`}>{t.qualityScore}分</span>}
                  </div>
                  <div className="text-sm text-white font-medium mb-1.5">{t.name}</div>
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

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${jobTypeColor[selected.jobType] || '#0066FF'}20`, color: jobTypeColor[selected.jobType] || '#0066FF' }}>{selected.jobType}</span>
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
                <div className="text-slate-500 mb-0.5">AI 建议</div>
                <div className="text-purple-300 font-mono">{selected.aiSuggestions}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">已采纳</div>
                <div className="text-green-300 font-mono">{selected.appliedSuggestions}</div>
              </div>
            </div>

            <div className="flex gap-2">
              {selected.status === 'running' ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5"><Pause className="w-3 h-3" />暂停</button>
                  <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5"><XCircle className="w-3 h-3" />中止</button>
                </>
              ) : selected.status === 'queued' ? (
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5"><Play className="w-3 h-3" />立即执行</button>
              ) : (
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5"><Eye className="w-3 h-3" />查看详情</button>
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

export default JobAssistantStatusMonitor;
