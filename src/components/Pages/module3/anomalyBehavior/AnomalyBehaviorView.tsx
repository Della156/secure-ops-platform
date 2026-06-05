'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Activity,
  User, AlertTriangle, Shield, TrendingUp, ChevronRight,
  Target, Zap, Brain, Layers, Clock, Cpu, MapPin
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface Anomaly {
  id: string;
  user: string;
  dept: string;
  anomalyType: '异常登录' | '数据外传' | '权限滥用' | '工作时间异常' | '访问异常' | '命令异常';
  severity: 'critical' | 'high' | 'medium';
  riskScore: number;
  confidence: number;
  status: 'investigating' | 'confirmed' | 'cleared' | 'monitoring';
  detected: string;
  description: string;
  deviation: number; // 偏离基准倍数
  baseline: string;
  actual: string;
}

const anomalies: Anomaly[] = [
  { id: 'AN-99821', user: 'zhang.wei', dept: '财务部', anomalyType: '数据外传', severity: 'critical', riskScore: 96, confidence: 92, status: 'investigating', detected: '2026-06-03 02:18:42', description: '凌晨 2 点下载财务数据 23GB，触发大量 DLP 告警', deviation: 35, baseline: '< 100MB/日', actual: '23.4GB' },
  { id: 'AN-99820', user: 'wang.fang', dept: '研发部', anomalyType: '异常登录', severity: 'high', riskScore: 82, confidence: 88, status: 'confirmed', detected: '2026-06-03 06:42:18', description: '异地登录：从北京突然出现在深圳 + 使用未注册设备', deviation: 12, baseline: '北京 (192.168.x.x)', actual: '深圳 (203.0.113.45)' },
  { id: 'AN-99819', user: 'li.na', dept: 'HR 部', anomalyType: '访问异常', severity: 'high', riskScore: 78, confidence: 85, status: 'confirmed', detected: '2026-06-03 09:18:32', description: '非工作时间访问核心代码库（平日无此行为）', deviation: 18, baseline: '9-18 点访问 ≤3 次/周', actual: '凌晨 2:15 访问 23 次' },
  { id: 'AN-99818', user: 'admin', dept: '运维部', anomalyType: '权限滥用', severity: 'critical', riskScore: 94, confidence: 96, status: 'confirmed', detected: '2026-06-03 09:32:18', description: '在多个非管理主机上使用域管理员账号登录', deviation: 25, baseline: '仅在 2 台 DC 操作', actual: '12 台主机登录' },
  { id: 'AN-99817', user: 'liu.gang', dept: '销售部', anomalyType: '权限滥用', severity: 'medium', riskScore: 65, confidence: 72, status: 'monitoring', detected: '2026-06-03 07:48:12', description: '访问了不在其职责范围的客户财务信息', deviation: 8, baseline: '仅访问销售客户', actual: '访问财务模块' },
  { id: 'AN-99816', user: 'chen.lei', dept: '研发部', anomalyType: '命令异常', severity: 'high', riskScore: 80, confidence: 90, status: 'investigating', detected: '2026-06-03 05:12:48', description: '在 Git 服务器执行可疑 git push 到外部仓库', deviation: 15, baseline: '仅 push 到内部', actual: 'push 到 github.com' },
  { id: 'AN-99815', user: 'zhao.min', dept: '法务部', anomalyType: '数据外传', severity: 'medium', riskScore: 62, confidence: 78, status: 'cleared', detected: '2026-06-02 22:32:15', description: '下载大量合同 PDF，已确认为正常工作（出庭准备）', deviation: 8, baseline: '< 50 份/周', actual: '125 份 (已确认)' },
  { id: 'AN-99814', user: 'svc-batch', dept: '系统', anomalyType: '工作时间异常', severity: 'medium', riskScore: 58, confidence: 70, status: 'monitoring', detected: '2026-06-03 03:48:32', description: '系统账号在凌晨执行非计划作业', deviation: 6, baseline: '仅 22-23 点执行', actual: '03:48 执行' },
];

const hourlyAnomalyTrend = [
  { hour: '00', count: 3 },
  { hour: '02', count: 8 },
  { hour: '04', count: 5 },
  { hour: '06', count: 12 },
  { hour: '08', count: 18 },
  { hour: '10', count: 15 },
  { hour: '12', count: 9 },
  { hour: '14', count: 22 },
  { hour: '16', count: 16 },
  { hour: '18', count: 7 },
  { hour: '20', count: 4 },
  { hour: '22', count: 2 },
];

const typeDist = [
  { name: '异常登录', value: 18, color: '#0066FF' },
  { name: '数据外传', value: 24, color: '#EF4444' },
  { name: '权限滥用', value: 16, color: '#FF6D00' },
  { name: '工作时间异常', value: 12, color: '#EAB308' },
  { name: '访问异常', value: 18, color: '#9333EA' },
  { name: '命令异常', value: 12, color: '#06B6D4' },
];

const severityColor: Record<Anomaly['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const statusConfig = {
  investigating: { label: '调查中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  confirmed: { label: '已确认', color: 'text-red-400', bg: 'bg-red-500/20' },
  cleared: { label: '已澄清', color: 'text-green-400', bg: 'bg-green-500/20' },
  monitoring: { label: '持续监控', color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

export function AnomalyBehaviorView() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = anomalies.filter(a => {
    if (search && !a.user.includes(search) && !a.id.includes(search)) return false;
    if (typeFilter !== 'all' && a.anomalyType !== typeFilter) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    confirmed: anomalies.filter(a => a.status === 'confirmed').length,
    investigating: anomalies.filter(a => a.status === 'investigating').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="异常事件" value={stats.total} color="#0066FF" icon={<AlertTriangle className="w-4 h-4" />} />
        <StatBox label="严重事件" value={stats.critical} color="#EF4444" icon={<Zap className="w-4 h-4" />} />
        <StatBox label="已确认" value={stats.confirmed} color="#FF6D00" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="调查中" value={stats.investigating} color="#EAB308" icon={<Eye className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">异常行为监测视图</h2>
            <p className="text-xs text-slate-500 mt-1">UEBA + 行为基线比对，6 大类异常行为自动识别</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Brain className="w-3.5 h-3.5" />AI 研判
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
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
              type="text" placeholder="搜索用户/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部类型</option>
            <option value="异常登录">异常登录</option>
            <option value="数据外传">数据外传</option>
            <option value="权限滥用">权限滥用</option>
            <option value="工作时间异常">工作时间异常</option>
            <option value="访问异常">访问异常</option>
            <option value="命令异常">命令异常</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部严重度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">异常事件 24 小时趋势</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyAnomalyTrend}>
              <defs>
                <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6D00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF6D00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="count" stroke="#FF6D00" strokeWidth={2} fill="url(#anomGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">异常类型分布</h3>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
                {typeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-0.5 mt-1">
            {typeDist.map(d => (
              <div key={d.name} className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded" style={{ background: d.color }} />{d.name}
                </span>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 事件列表 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">异常事件列表</h3>
          <span className="text-xs text-slate-500">共 {filtered.length} 条</span>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {filtered.map(a => {
            const sc = statusConfig[a.status as keyof typeof statusConfig];
            return (
              <div key={a.id} className="px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-blue-400 font-mono">{a.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-500/20 text-blue-400">{a.anomalyType}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 border rounded ${
                    a.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    a.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                  }`}>
                    {a.severity === 'critical' ? '严重' : a.severity === 'high' ? '高' : '中'}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                  <div className="flex-1" />
                  <span className="text-[10px] text-slate-500 font-mono">{a.detected}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-semibold">
                    {a.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{a.user} <span className="text-slate-500 text-xs font-normal">· {a.dept}</span></div>
                  </div>
                  <span className="text-[10px] text-slate-500">风险分 <span className={`${a.riskScore >= 90 ? 'text-red-400' : a.riskScore >= 70 ? 'text-orange-400' : 'text-yellow-400'} font-mono`}>{a.riskScore}</span></span>
                  <span className="text-[10px] text-slate-500">置信度 <span className="text-blue-400 font-mono">{a.confidence}%</span></span>
                </div>
                <div className="text-xs text-slate-300 mb-1.5">{a.description}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>基准: <span className="text-slate-300 font-mono">{a.baseline}</span></span>
                  <ChevronRight className="w-2.5 h-2.5" />
                  <span>实际: <span className="text-red-300 font-mono">{a.actual}</span></span>
                  <span>·</span>
                  <span className="text-orange-400">偏离 {a.deviation}×</span>
                </div>
              </div>
            );
          })}
        </div>
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

export default AnomalyBehaviorView;
