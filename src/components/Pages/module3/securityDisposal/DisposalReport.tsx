'use client';

import React, { useState } from 'react';
import {
  FileText, Download, RefreshCw, Eye, Calendar,
  TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Shield, Zap, Activity, BarChart3, BarChart, PieChart
} from 'lucide-react';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const reportData = {
  period: '2026-06-01 至 2026-06-03',
  totalTasks: 156,
  autoTasks: 122,
  manualTasks: 34,
  successRate: 94.2,
  avgTime: '3.2 分钟',
  affectedAssets: 234,
  topThreats: [
    { name: '挖矿木马', count: 45 },
    { name: '钓鱼邮件', count: 38 },
    { name: 'CVE 漏洞', count: 28 },
    { name: '横向移动', count: 22 },
    { name: 'WebShell', count: 15 },
    { name: 'DDoS 攻击', count: 8 },
  ],
  dailyTrend: [
    { date: '06-01', auto: 38, manual: 12, total: 50 },
    { date: '06-02', auto: 42, manual: 10, total: 52 },
    { date: '06-03', auto: 42, manual: 12, total: 54 },
  ],
  disposalType: [
    { name: '主机隔离', value: 42, color: '#FF6D00' },
    { name: '进程查杀', value: 38, color: '#EF4444' },
    { name: '邮件删除', value: 35, color: '#EAB308' },
    { name: '补丁推送', value: 25, color: '#22C55E' },
    { name: '账号冻结', value: 16, color: '#0066FF' },
  ],
  approvalStats: {
    pending: 3,
    approved: 28,
    rejected: 2,
  },
  hotspots: [
    { name: 'Web 服务器集群', count: 28, risk: 'high' },
    { name: '办公终端区', count: 45, risk: 'medium' },
    { name: '数据库服务器', count: 12, risk: 'critical' },
    { name: '边界网络设备', count: 8, risk: 'medium' },
  ],
};

export function DisposalReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">安全综合处置任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">包含处置总览、自动处置率、审批通过率、处置类型分布</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              <option value="1d">过去 1 天</option>
              <option value="7d">过去 7 天</option>
              <option value="30d">过去 30 天</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />下载报告
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总处置任务" value={reportData.totalTasks} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="自动处置率" value={`${reportData.successRate}%`} color="#22C55E" icon={<Zap className="w-4 h-4" />} trend="up" />
        <StatBox label="平均处置时间" value={reportData.avgTime} color="#9333EA" icon={<Activity className="w-4 h-4" />} trend="down" />
        <StatBox label="影响资产" value={reportData.affectedAssets} color="#FF6D00" icon={<Shield className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">处置任务趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={reportData.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line type="monotone" dataKey="auto" name="自动处置" stroke="#22C55E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="manual" name="人工处置" stroke="#0066FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">处置类型分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={reportData.disposalType}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {reportData.disposalType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">威胁类型 TOP 6</h3>
          <div className="space-y-2">
            {reportData.topThreats.map((threat, index) => (
              <div key={index} className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{threat.name}</span>
                  <span className="text-xs font-mono text-blue-400">{threat.count}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(threat.count / reportData.totalTasks) * 350}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">审批统计</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-yellow-500/20 rounded-lg p-3 text-center border border-yellow-500/30">
              <div className="text-xs text-yellow-400 mb-1">待审批</div>
              <div className="text-xl font-semibold text-white">{reportData.approvalStats.pending}</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3 text-center border border-green-500/30">
              <div className="text-xs text-green-400 mb-1">已通过</div>
              <div className="text-xl font-semibold text-white">{reportData.approvalStats.approved}</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3 text-center border border-red-500/30">
              <div className="text-xs text-red-400 mb-1">已拒绝</div>
              <div className="text-xl font-semibold text-white">{reportData.approvalStats.rejected}</div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white mb-3 mt-4">风险热点区域</h3>
          <div className="space-y-2">
            {reportData.hotspots.map((hotspot, index) => (
              <div key={index} className="bg-[#111625] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">{hotspot.name}</div>
                  <div className="text-xs text-slate-500">{hotspot.count} 次事件</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  hotspot.risk === 'critical' ? 'bg-red-500/20 text-red-400' :
                  hotspot.risk === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {hotspot.risk === 'critical' ? '紧急' : hotspot.risk === 'high' ? '高' : '中'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">报告摘要</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>在 <span className="text-blue-400">{reportData.period}</span> 期间，系统共执行 <span className="text-blue-400 font-semibold">{reportData.totalTasks}</span> 次安全处置任务。</p>
          <p>其中，自动处置 <span className="text-green-400 font-semibold">{reportData.autoTasks}</span> 次，人工处置 <span className="text-purple-400 font-semibold">{reportData.manualTasks}</span> 次，整体成功率达到 <span className="text-green-400 font-semibold">{reportData.successRate}%</span>。</p>
          <p>主要威胁类型为 <span className="text-orange-400">挖矿木马</span>、<span className="text-yellow-400">钓鱼邮件</span> 和 <span className="text-red-400">CVE 漏洞</span>。</p>
          <p>需要重点关注 <span className="text-red-400">数据库服务器</span> 和 <span className="text-orange-400">Web 服务器集群</span> 的安全风险。</p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon, trend }: { label: string; value: any; color: string; icon: React.ReactNode; trend?: 'up' | 'down' }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-400" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-blue-400" />}
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default DisposalReport;
