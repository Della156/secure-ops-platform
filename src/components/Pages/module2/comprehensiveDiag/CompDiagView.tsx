'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Activity, Server, Database,
  Network, Shield, AlertCircle, CheckCircle2, XCircle, Clock, Calendar, User,
  TrendingUp, Zap, Cpu, HardDrive, Wifi, BarChart3, ArrowRight, ChevronRight,
  Play, Pause, FileText, ListTree, Layers
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

interface DiagCase {
  id: string;
  name: string;
  symptom: string;
  rootCause: string;
  affectedScope: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'diagnosing' | 'fixing' | 'resolved' | 'pending';
  startTime: string;
  endTime?: string;
  duration: string;
  assignee: string;
  steps: number;
  completedSteps: number;
  systemsInvolved: number;
  businessImpact: string;
  autoFixed: boolean;
  confidence: number; // 0-100
}

const cases: DiagCase[] = [
  { id: 'CD-99831', name: '生产数据库连接池耗尽导致响应慢', symptom: '应用响应时间从 200ms 增长到 8s', rootCause: '连接池 max=100，但突发 150 并发导致排队', affectedScope: '订单服务 / 用户服务 / 支付服务', severity: 'critical', status: 'fixing', startTime: '2026-06-03 10:45:18', duration: '00:18:42', assignee: '王芳', steps: 8, completedSteps: 5, systemsInvolved: 4, businessImpact: '交易延迟 8s，10% 用户支付失败', autoFixed: false, confidence: 94 },
  { id: 'CD-99830', name: 'Web 服务器 CPU 持续 95%+', symptom: 'CPU 持续高位 95% 超过 30 分钟', rootCause: 'Tomcat 线程死锁导致资源未释放', affectedScope: 'Web-01 / Web-02', severity: 'high', status: 'diagnosing', startTime: '2026-06-03 10:12:00', duration: '00:48:18', assignee: '陈磊', steps: 6, completedSteps: 3, systemsInvolved: 2, businessImpact: '页面加载慢 3-5s', autoFixed: true, confidence: 88 },
  { id: 'CD-99829', name: '存储 IO 延迟突增', symptom: '磁盘 IO 延迟从 5ms 增加到 200ms', rootCause: '存储控制器缓存模块异常', affectedScope: '生产存储 LUN 12-15', severity: 'critical', status: 'resolved', startTime: '2026-06-03 08:30:00', endTime: '2026-06-03 09:45:00', duration: '01:15:00', assignee: '刘洋', steps: 10, completedSteps: 10, systemsInvolved: 3, businessImpact: '已恢复', autoFixed: false, confidence: 92 },
  { id: 'CD-99828', name: '网络抖动导致 API 调用超时', symptom: '跨机房 API 调用 5% 超时', rootCause: 'BGP 路由收敛期间丢包', affectedScope: '核心交换机 SW-CORE-01', severity: 'medium', status: 'resolved', startTime: '2026-06-02 22:15:00', endTime: '2026-06-02 22:48:00', duration: '00:33:00', assignee: '李娜', steps: 5, completedSteps: 5, systemsInvolved: 2, businessImpact: '已自动恢复', autoFixed: true, confidence: 86 },
  { id: 'CD-99827', name: 'ActiveMQ 消息堆积', symptom: '队列消息量从 1k 增长到 850k', rootCause: '消费者服务异常停止消费', affectedScope: '消息队列 MQ-PROD', severity: 'high', status: 'pending', startTime: '2026-06-03 09:00:00', duration: '02:00:00', assignee: '陈磊', steps: 4, completedSteps: 0, systemsInvolved: 3, businessImpact: '短信通知延迟 30min', autoFixed: false, confidence: 90 },
  { id: 'CD-99826', name: '防火墙会话表满', symptom: '新建连接 10% 失败', rootCause: '会话表容量接近上限', affectedScope: '边界防火墙 FW-EDGE-01', severity: 'medium', status: 'resolved', startTime: '2026-06-02 16:30:00', endTime: '2026-06-02 17:15:00', duration: '00:45:00', assignee: '李娜', steps: 4, completedSteps: 4, systemsInvolved: 1, businessImpact: '已调整超时', autoFixed: true, confidence: 95 },
];

const statusConfig = {
  diagnosing: { label: '诊断中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  fixing: { label: '修复中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  resolved: { label: '已解决', color: 'text-green-400', bg: 'bg-green-500/20' },
  pending: { label: '待处理', color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

const severityConfig = {
  critical: { label: '严重', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  high: { label: '高', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  medium: { label: '中', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  low: { label: '低', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
};

// 趋势
const trendData = [
  { time: '08:00', open: 3, resolved: 2 },
  { time: '09:00', open: 4, resolved: 4 },
  { time: '10:00', open: 5, resolved: 5 },
  { time: '11:00', open: 4, resolved: 6 },
  { time: '12:00', open: 2, resolved: 7 },
];

// 故障分类
const faultTypeDist = [
  { type: '数据库', count: 28, color: '#22C55E' },
  { type: '应用', count: 35, color: '#FF6D00' },
  { type: '网络', count: 22, color: '#06B6D4' },
  { type: '存储', count: 15, color: '#9333EA' },
  { type: '中间件', count: 18, color: '#EAB308' },
  { type: '安全', count: 8, color: '#EF4444' },
];

export function CompDiagView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('CD-99831');

  const filtered = cases.filter(c => {
    if (search && !c.name.includes(search) && !c.id.includes(search)) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
    return true;
  });

  const selected = selectedId ? cases.find(c => c.id === selectedId) : null;
  const stats = {
    total: cases.length,
    diagnosing: cases.filter(c => c.status === 'diagnosing' || c.status === 'fixing').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
    autoFixRate: ((cases.filter(c => c.autoFixed).length / cases.length) * 100).toFixed(0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="诊断案例" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="进行中" value={stats.diagnosing} color="#FF6D00" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="已解决" value={stats.resolved} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="AI 自愈率" value={`${stats.autoFixRate}%`} color="#9333EA" icon={<Zap className="w-4 h-4" />} />
      </div>

      {/* 趋势 + 类型分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">今日诊断趋势</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6D00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF6D00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="open" stroke="#FF6D00" fill="url(#openGrad)" name="进行中" />
              <Area type="monotone" dataKey="resolved" stroke="#22C55E" fill="url(#resolvedGrad)" name="已解决" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">故障类型分布</h3>
          <div className="space-y-1.5">
            {faultTypeDist.map(f => (
              <div key={f.type} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-12">{f.type}</span>
                <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(f.count / 35) * 100}%`, background: f.color }} />
                </div>
                <span className="text-[10px] text-slate-300 font-mono w-6 text-right">{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断视图</h2>
            <p className="text-xs text-slate-500 mt-1">跨系统 / 网络 / 存储 / 数据库 / 应用 / 中间件 / 安全 — 全栈故障诊断</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建诊断
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索案例/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="diagnosing">诊断中</option>
            <option value="fixing">修复中</option>
            <option value="resolved">已解决</option>
            <option value="pending">待处理</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">诊断案例 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(c => {
              const sc = statusConfig[c.status as keyof typeof statusConfig];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === c.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{c.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${severityConfig[c.severity as keyof typeof severityConfig]}`}>{severityConfig[c.severity as keyof typeof severityConfig].label}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                    {c.autoFixed && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">AI 自愈</span>}
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{c.duration}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{c.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1.5">症状: {c.symptom}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{c.assignee}</span>
                    <span>·</span>
                    <span>影响 <span className="text-red-300">{c.systemsInvolved} 系统</span></span>
                    <span>·</span>
                    <span>置信度 <span className="text-blue-300 font-mono">{c.confidence}%</span></span>
                    <span>·</span>
                    <span>{c.completedSteps}/{c.steps} 步</span>
                  </div>
                  {c.status !== 'resolved' && c.status !== 'pending' && (
                    <div className="mt-1.5 h-1 bg-[#111625] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.completedSteps / c.steps) * 100}%` }} />
                    </div>
                  )}
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
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${severityConfig[selected.severity as keyof typeof severityConfig]}`}>{severityConfig[selected.severity as keyof typeof severityConfig].label}</span>
                {selected.autoFixed && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">AI 自愈</span>}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">症状</div>
                <div className="text-orange-300 text-[10px]">{selected.symptom}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">根因</div>
                <div className="text-red-300 text-[10px]">{selected.rootCause}</div>
              </div>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">影响范围</div>
              <div className="text-xs text-yellow-300">{selected.affectedScope}</div>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">业务影响</div>
              <div className="text-xs text-red-300">{selected.businessImpact}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">负责人</div>
                <div className="text-yellow-300">{selected.assignee}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">置信度</div>
                <div className="text-green-400 font-mono">{selected.confidence}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">步骤</div>
                <div className="text-lg font-bold text-blue-400">{selected.completedSteps}/{selected.steps}</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">涉及系统</div>
                <div className="text-lg font-bold text-purple-400">{selected.systemsInvolved}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Eye className="w-3 h-3" />查看详情
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Zap className="w-3 h-3" />立即处置
              </button>
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

export default CompDiagView;
