'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, RefreshCw, Download, Filter, Eye, Pause, Play, RotateCcw,
  XCircle, CheckCircle2, Clock, Activity, Server, Cpu, Database,
  Shield, Network, ChevronRight, X, AlertCircle, TrendingUp
} from 'lucide-react';

type RunStatus = 'running' | 'success' | 'failed' | 'pending' | 'paused' | 'warning';
type TaskType = '安全扫描' | '基线检查' | '漏洞修复' | '资产发现' | '日志分析' | '补丁分发' | '配置备份';

interface TaskRun {
  id: string;
  name: string;
  type: TaskType;
  status: RunStatus;
  progress: number;
  startTime: string;
  endTime: string | null;
  duration: string;
  executor: string;
  target: string;
  logsCount: number;
  retryCount: number;
  priority: '高' | '中' | '低';
}

const mockRuns: TaskRun[] = [
  { id: 'RUN-2026060301', name: '核心服务器基线检查', type: '基线检查', status: 'running', progress: 68, startTime: '2026-06-03 09:42:18', endTime: null, duration: '17分42秒', executor: '系统调度', target: '12 台主机', logsCount: 1247, retryCount: 0, priority: '高' },
  { id: 'RUN-2026060302', name: 'Web 资产漏洞扫描', type: '安全扫描', status: 'running', progress: 42, startTime: '2026-06-03 09:30:00', endTime: null, duration: '29分18秒', executor: '张工', target: '48 个域名', logsCount: 892, retryCount: 0, priority: '中' },
  { id: 'RUN-2026060303', name: '夜间日志聚合分析', type: '日志分析', status: 'success', progress: 100, startTime: '2026-06-03 02:00:00', endTime: '2026-06-03 03:24:15', duration: '1小时24分', executor: '系统调度', target: '32 个数据源', logsCount: 45820, retryCount: 0, priority: '低' },
  { id: 'RUN-2026060304', name: '高危漏洞 CVE-2024-3094 修复', type: '漏洞修复', status: 'failed', progress: 67, startTime: '2026-06-03 01:12:00', endTime: '2026-06-03 01:34:22', duration: '22分22秒', executor: '李工', target: '23 台 Linux', logsCount: 384, retryCount: 2, priority: '高' },
  { id: 'RUN-2026060305', name: '新接入终端发现', type: '资产发现', status: 'pending', progress: 0, startTime: '2026-06-03 10:00:00', endTime: null, duration: '排队中', executor: '系统调度', target: '全网段', logsCount: 0, retryCount: 0, priority: '中' },
  { id: 'RUN-2026060306', name: '数据库配置定期备份', type: '配置备份', status: 'success', progress: 100, startTime: '2026-06-03 00:00:00', endTime: '2026-06-03 00:08:45', duration: '8分45秒', executor: '系统调度', target: '6 个数据库', logsCount: 256, retryCount: 0, priority: '低' },
  { id: 'RUN-2026060307', name: '主机补丁批量分发', type: '补丁分发', status: 'warning', progress: 88, startTime: '2026-06-03 08:15:00', endTime: null, duration: '1小时45分', executor: '王工', target: '156 台主机', logsCount: 2103, retryCount: 1, priority: '中' },
  { id: 'RUN-2026060308', name: '暂停的渗透测试', type: '安全扫描', status: 'paused', progress: 35, startTime: '2026-06-03 09:00:00', endTime: null, duration: '59分30秒', executor: '安全团队', target: '内部 5 个站点', logsCount: 412, retryCount: 0, priority: '低' },
  { id: 'RUN-2026060309', name: '中间件基线核查', type: '基线检查', status: 'success', progress: 100, startTime: '2026-06-03 06:00:00', endTime: '2026-06-03 06:42:18', duration: '42分18秒', executor: '系统调度', target: '18 个中间件', logsCount: 1284, retryCount: 0, priority: '中' },
  { id: 'RUN-2026060310', name: '边界防火墙策略同步', type: '配置备份', status: 'failed', progress: 23, startTime: '2026-06-03 05:30:00', endTime: '2026-06-03 05:34:12', duration: '4分12秒', executor: '系统调度', target: '8 台防火墙', logsCount: 89, retryCount: 3, priority: '高' },
  { id: 'RUN-2026060311', name: '云资源资产同步', type: '资产发现', status: 'success', progress: 100, startTime: '2026-06-03 04:00:00', endTime: '2026-06-03 04:18:33', duration: '18分33秒', executor: '系统调度', target: 'AWS/Azure/阿里云', logsCount: 528, retryCount: 0, priority: '低' },
  { id: 'RUN-2026060312', name: '外网暴露面资产梳理', type: '资产发现', status: 'running', progress: 91, startTime: '2026-06-03 09:50:00', endTime: null, duration: '9分42秒', executor: '张工', target: '外网 IP 段', logsCount: 186, retryCount: 0, priority: '中' },
];

const statusConfig: Record<RunStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  running: { label: '运行中', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40', icon: <Activity className="w-3.5 h-3.5 animate-pulse" /> },
  success: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40', icon: <XCircle className="w-3.5 h-3.5" /> },
  pending: { label: '等待中', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40', icon: <Clock className="w-3.5 h-3.5" /> },
  paused: { label: '已暂停', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', icon: <Pause className="w-3.5 h-3.5" /> },
  warning: { label: '部分异常', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const typeIcon: Record<TaskType, React.ReactNode> = {
  '安全扫描': <Shield className="w-4 h-4" />,
  '基线检查': <CheckCircle2 className="w-4 h-4" />,
  '漏洞修复': <AlertCircle className="w-4 h-4" />,
  '资产发现': <Network className="w-4 h-4" />,
  '日志分析': <Database className="w-4 h-4" />,
  '补丁分发': <Server className="w-4 h-4" />,
  '配置备份': <Cpu className="w-4 h-4" />,
};

const priorityColor = (p: string) =>
  p === '高' ? 'text-red-400 bg-red-500/10' : p === '中' ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-400 bg-slate-500/10';

export function TaskRunStatusList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('today');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockRuns.filter(r => {
      if (search && !r.name.includes(search) && !r.id.includes(search) && !r.target.includes(search)) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: mockRuns.length,
    running: mockRuns.filter(r => r.status === 'running').length,
    success: mockRuns.filter(r => r.status === 'success').length,
    failed: mockRuns.filter(r => r.status === 'failed').length,
    pending: mockRuns.filter(r => r.status === 'pending' || r.status === 'paused').length,
  }), []);

  const selected = selectedId ? mockRuns.find(r => r.id === selectedId) : null;

  return (
    <div className="p-6 space-y-4">
      {/* 顶部 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="任务总数" value={stats.total} color="#0066FF" icon={<Server className="w-4 h-4" />} />
        <StatCard label="运行中" value={stats.running} color="#00C853" icon={<Activity className="w-4 h-4" />} pulse />
        <StatCard label="已完成" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatCard label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatCard label="等待/暂停" value={stats.pending} color="#EAB308" icon={<Clock className="w-4 h-4" />} />
      </div>

      {/* 头部操作栏 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">任务运行状态列表</h2>
            <p className="text-xs text-slate-500 mt-1">实时展示所有自动化任务的执行情况</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <RotateCcw className="w-3.5 h-3.5" />手动重试
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>

        {/* 筛选区 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索任务名/ID/目标"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="running">运行中</option>
            <option value="success">已完成</option>
            <option value="failed">失败</option>
            <option value="pending">等待中</option>
            <option value="paused">已暂停</option>
            <option value="warning">部分异常</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="安全扫描">安全扫描</option>
            <option value="基线检查">基线检查</option>
            <option value="漏洞修复">漏洞修复</option>
            <option value="资产发现">资产发现</option>
            <option value="日志分析">日志分析</option>
            <option value="补丁分发">补丁分发</option>
            <option value="配置备份">配置备份</option>
          </select>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="today">今日</option>
            <option value="3days">近 3 天</option>
            <option value="week">近 7 天</option>
            <option value="month">近 30 天</option>
          </select>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-3 py-2.5">任务 ID</th>
              <th className="text-left px-3 py-2.5">任务名称</th>
              <th className="text-left px-3 py-2.5">类型</th>
              <th className="text-left px-3 py-2.5">状态</th>
              <th className="text-left px-3 py-2.5 min-w-[140px]">进度</th>
              <th className="text-left px-3 py-2.5">优先级</th>
              <th className="text-left px-3 py-2.5">执行人</th>
              <th className="text-left px-3 py-2.5">目标</th>
              <th className="text-left px-3 py-2.5">开始时间</th>
              <th className="text-left px-3 py-2.5">耗时</th>
              <th className="text-left px-3 py-2.5">日志</th>
              <th className="text-right px-3 py-2.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const sc = statusConfig[r.status];
              return (
                <tr key={r.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer" onClick={() => setSelectedId(r.id)}>
                  <td className="px-3 py-2.5 text-blue-400 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2.5 text-white">{r.name}</td>
                  <td className="px-3 py-2.5 text-slate-300">
                    <span className="inline-flex items-center gap-1.5">{typeIcon[r.type]}{r.type}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.status === 'failed' ? 'bg-red-500' : r.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${r.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-9 text-right">{r.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColor(r.priority)}`}>{r.priority}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 text-xs">{r.executor}</td>
                  <td className="px-3 py-2.5 text-slate-300 text-xs">{r.target}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">{r.startTime}</td>
                  <td className="px-3 py-2.5 text-slate-300 text-xs">{r.duration}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">{r.logsCount.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <button className="p-1 hover:bg-[#2A354D] rounded" title="查看"><Eye className="w-3.5 h-3.5 text-slate-400" /></button>
                      {r.status === 'running' && (
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="暂停"><Pause className="w-3.5 h-3.5 text-orange-400" /></button>
                      )}
                      {r.status === 'paused' && (
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="继续"><Play className="w-3.5 h-3.5 text-green-400" /></button>
                      )}
                      {r.status === 'failed' && (
                        <button className="p-1 hover:bg-[#2A354D] rounded" title="重试"><RotateCcw className="w-3.5 h-3.5 text-blue-400" /></button>
                      )}
                      <button className="p-1 hover:bg-[#2A354D] rounded" title="停止"><XCircle className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">没有匹配的任务</div>
        )}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filtered.length} 条记录 / 总 {mockRuns.length} 条</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">2</button>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>

      {/* 详情侧边栏 */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-[#111625] border-l border-[#2A354D] z-50 overflow-y-auto shadow-2xl">
          <div className="p-4 border-b border-[#2A354D] flex items-center justify-between sticky top-0 bg-[#111625] z-10">
            <h3 className="text-white font-semibold">任务详情</h3>
            <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-[#2A354D] rounded"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-1">任务 ID</div>
              <div className="text-blue-400 font-mono">{selected.id}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">任务名称</div>
              <div className="text-white font-medium">{selected.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="类型" value={selected.type} />
              <Field label="优先级" value={selected.priority} />
              <Field label="执行人" value={selected.executor} />
              <Field label="目标范围" value={selected.target} />
              <Field label="开始时间" value={selected.startTime} />
              <Field label="耗时" value={selected.duration} />
              <Field label="重试次数" value={String(selected.retryCount)} />
              <Field label="日志条目" value={selected.logsCount.toLocaleString()} />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-2">执行进度</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#20293F] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selected.status === 'failed' ? 'bg-red-500' : selected.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${selected.progress}%` }} />
                </div>
                <span className="text-sm text-slate-300 w-12 text-right">{selected.progress}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-2">执行节点</div>
              <div className="space-y-1.5">
                {['任务初始化', '目标发现', '任务下发', '执行中', '结果汇总', '完成归档'].map((step, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${i < (selected.progress / 20) ? 'text-green-400' : 'text-slate-500'}`}>
                    {i < (selected.progress / 20) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />查看完整日志
              </button>
              {selected.status === 'failed' && (
                <button className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />重试任务
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon, pulse }: { label: string; value: number; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }} className={pulse ? 'animate-pulse' : ''}>{icon}</span>
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-slate-200">{value}</div>
    </div>
  );
}

export default TaskRunStatusList;
