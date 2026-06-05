'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, Calendar, Clock, User,
  CheckCircle2, XCircle, AlertCircle, FileText, BarChart3, Server,
  Database, Network, TrendingUp, Award, ListTree, ChevronRight, Printer
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface DiagReport {
  id: string;
  name: string;
  category: '网络' | '数据库' | '应用' | '存储' | '安全' | '硬件';
  taskNo: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'success' | 'partial' | 'failed';
  rootCause: string;
  affectedNodes: number;
  owner: string;
  confidence: number;
  businessImpact: string;
  rcaMethod: '5WHY' | '鱼骨图' | 'FMEA' | '故障树' | 'AHP';
  mttr: string; // 平均恢复时间
  mtbf: string; // 平均故障间隔
  score: number; // 0-100 综合评分
  improvements: number;
}

const reports: DiagReport[] = [
  { id: 'CDR-99832', name: '生产数据库连接池异常诊断报告', category: '数据库', taskNo: 'CD-M-99821', startTime: '2026-06-03 10:45:18', endTime: '2026-06-03 11:32:00', duration: '00:46:42', status: 'success', rootCause: '连接池 max=100，突发 150 并发排队', affectedNodes: 4, owner: '王芳', confidence: 94, businessImpact: '交易延迟 8s，10% 支付失败', rcaMethod: '5WHY', mttr: '47min', mtbf: '12天', score: 92, improvements: 2 },
  { id: 'CDR-99831', name: 'Web 集群 CPU 异常诊断报告', category: '应用', taskNo: 'CD-M-99820', startTime: '2026-06-03 10:12:00', endTime: '2026-06-03 11:48:00', duration: '01:36:00', status: 'partial', rootCause: 'Tomcat 线程死锁', affectedNodes: 2, owner: '陈磊', confidence: 88, businessImpact: '页面加载 3-5s', rcaMethod: '故障树', mttr: '1.5h', mtbf: '7天', score: 78, improvements: 3 },
  { id: 'CDR-99830', name: '存储 IO 延迟诊断报告', category: '存储', taskNo: 'CD-M-99819', startTime: '2026-06-03 08:30:00', endTime: '2026-06-03 09:45:00', duration: '01:15:00', status: 'success', rootCause: '存储控制器缓存模块异常', affectedNodes: 3, owner: '刘洋', confidence: 92, businessImpact: '业务恢复', rcaMethod: '鱼骨图', mttr: '1.2h', mtbf: '30天', score: 95, improvements: 1 },
  { id: 'CDR-99829', name: '网络抖动问题诊断报告', category: '网络', taskNo: 'CD-M-99818', startTime: '2026-06-02 22:15:00', endTime: '2026-06-02 22:48:00', duration: '00:33:00', status: 'success', rootCause: 'BGP 路由收敛', affectedNodes: 2, owner: '李娜', confidence: 86, businessImpact: '5% API 超时', rcaMethod: '5WHY', mttr: '33min', mtbf: '15天', score: 88, improvements: 2 },
  { id: 'CDR-99828', name: 'MQ 消息堆积诊断报告', category: '应用', taskNo: 'CD-M-99827', startTime: '2026-06-02 18:00:00', endTime: '2026-06-02 19:30:00', duration: '01:30:00', status: 'success', rootCause: '消费者停止消费', affectedNodes: 3, owner: '陈磊', confidence: 90, businessImpact: '短信延迟 30min', rcaMethod: 'FMEA', mttr: '1.5h', mtbf: '10天', score: 85, improvements: 1 },
  { id: 'CDR-99827', name: '防火墙会话表满诊断报告', category: '安全', taskNo: 'CD-M-99816', startTime: '2026-06-02 16:30:00', endTime: '2026-06-02 17:15:00', duration: '00:45:00', status: 'success', rootCause: '会话表容量上限', affectedNodes: 1, owner: '李娜', confidence: 95, businessImpact: '10% 新建连接失败', rcaMethod: '5WHY', mttr: '45min', mtbf: '20天', score: 93, improvements: 1 },
  { id: 'CDR-99826', name: 'K8s Pod OOMKilled 诊断报告', category: '应用', taskNo: 'CD-M-99825', startTime: '2026-06-01 14:00:00', endTime: '2026-06-01 14:25:00', duration: '00:25:00', status: 'success', rootCause: 'JVM 堆内存不足', affectedNodes: 5, owner: '陈磊', confidence: 92, businessImpact: 'Pod 重启 3 次', rcaMethod: 'AHP', mttr: '25min', mtbf: '8天', score: 90, improvements: 1 },
  { id: 'CDR-99825', name: '数据库主从延迟诊断报告', category: '数据库', taskNo: 'CD-M-99824', startTime: '2026-05-31 10:00:00', endTime: '2026-05-31 12:30:00', duration: '02:30:00', status: 'partial', rootCause: '大事务 + 慢 SQL', affectedNodes: 2, owner: '王芳', confidence: 85, businessImpact: '从库延迟 15s', rcaMethod: '故障树', mttr: '2.5h', mtbf: '5天', score: 75, improvements: 4 },
];

const statusConfig = {
  success: { label: '已解决', color: 'text-green-400', bg: 'bg-green-500/20' },
  partial: { label: '部分解决', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '未解决', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const categoryColor: Record<DiagReport['category'], string> = {
  网络: '#06B6D4',
  数据库: '#22C55E',
  应用: '#FF6D00',
  存储: '#9333EA',
  安全: '#EF4444',
  硬件: '#EAB308',
};

// 评分分布
const scoreDist = [
  { range: '90-100', count: 8, color: '#22C55E' },
  { range: '80-89', count: 12, color: '#0066FF' },
  { range: '70-79', count: 6, color: '#FF6D00' },
  { range: '<70', count: 3, color: '#EF4444' },
];

// 月度趋势
const monthlyTrend = [
  { month: '1月', count: 28, avgScore: 78, mttr: 65 },
  { month: '2月', count: 25, avgScore: 80, mttr: 58 },
  { month: '3月', count: 32, avgScore: 83, mttr: 52 },
  { month: '4月', count: 30, avgScore: 85, mttr: 48 },
  { month: '5月', count: 35, avgScore: 87, mttr: 45 },
  { month: '6月', count: 18, avgScore: 89, mttr: 42 },
];

// 报告质量雷达
const qualityRadar = [
  { dim: '完整性', value: 92 },
  { dim: '准确性', value: 88 },
  { dim: '可操作性', value: 85 },
  { dim: '复用性', value: 80 },
  { dim: '合规性', value: 90 },
  { dim: '及时性', value: 86 },
];

export function CompDiagTaskReport() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('CDR-99832');

  const filtered = reports.filter(r => {
    if (search && !r.name.includes(search) && !r.id.includes(search)) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const selected = selectedId ? reports.find(r => r.id === selectedId) : null;
  const stats = {
    total: reports.length,
    success: reports.filter(r => r.status === 'success').length,
    partial: reports.filter(r => r.status === 'partial').length,
    avgScore: (reports.reduce((s, r) => s + r.score, 0) / reports.length).toFixed(1),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="报告总数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="已解决" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="部分解决" value={stats.partial} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="平均评分" value={stats.avgScore} color="#9333EA" icon={<Award className="w-4 h-4" />} />
      </div>

      {/* 趋势 + 分布 + 雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">月度诊断报告趋势</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[60, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} name="平均评分" />
              <Line yAxisId="right" type="monotone" dataKey="mttr" stroke="#FF6D00" strokeWidth={2} dot={{ fill: '#FF6D00' }} name="MTTR(min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">报告质量维度</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RadarChart data={qualityRadar}>
              <PolarGrid stroke="#2A354D" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断任务报告</h2>
            <p className="text-xs text-slate-500 mt-1">综合诊断报告，含 RCA 方法、MTTR/MTBF、评分、改进项</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Printer className="w-3.5 h-3.5" />打印
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />批量导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索报告/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="success">已解决</option>
            <option value="partial">部分解决</option>
            <option value="failed">未解决</option>
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

      {/* 报告列表 + 详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">报告列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(r => {
              const sc = statusConfig[r.status as keyof typeof statusConfig];
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[r.category]}20`, color: categoryColor[r.category] }}>{r.category}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">{r.rcaMethod}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div className="flex-1" />
                    <span className={`text-[10px] font-mono ${r.score >= 90 ? 'text-green-400' : r.score >= 75 ? 'text-orange-400' : 'text-red-400'}`}>{r.score}分</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1.5">根因: {r.rootCause}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.owner}</span>
                    <span>·</span>
                    <span>MTTR <span className="text-blue-300 font-mono">{r.mttr}</span></span>
                    <span>·</span>
                    <span>MTBF <span className="text-green-300 font-mono">{r.mtbf}</span></span>
                    <span>·</span>
                    <span>改进 {r.improvements}</span>
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
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>{selected.category}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">{selected.rcaMethod}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status as keyof typeof statusConfig].bg} ${statusConfig[selected.status as keyof typeof statusConfig].color}`}>{statusConfig[selected.status as keyof typeof statusConfig].label}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            {/* 评分 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded p-3 text-center">
              <div className="text-[10px] text-slate-400 mb-1">综合评分</div>
              <div className={`text-3xl font-bold ${selected.score >= 90 ? 'text-green-400' : selected.score >= 75 ? 'text-orange-400' : 'text-red-400'}`}>{selected.score}</div>
              <div className="w-full h-1.5 bg-[#111625] rounded-full overflow-hidden mt-1.5">
                <div className={`h-full rounded-full ${selected.score >= 90 ? 'bg-green-500' : selected.score >= 75 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${selected.score}%` }} />
              </div>
            </div>

            <div className="bg-[#111625] border border-red-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">根因</div>
              <div className="text-xs text-red-300">{selected.rootCause}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">MTTR</div>
                <div className="text-blue-300 font-mono">{selected.mttr}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">MTBF</div>
                <div className="text-green-300 font-mono">{selected.mtbf}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">影响节点</div>
                <div className="text-slate-200 font-mono">{selected.affectedNodes}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">置信度</div>
                <div className="text-purple-300 font-mono">{selected.confidence}%</div>
              </div>
            </div>

            <div className="bg-[#111625] border border-orange-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">业务影响</div>
              <div className="text-xs text-orange-300">{selected.businessImpact}</div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
                <Eye className="w-3 h-3" />查看报告
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
                <Download className="w-3 h-3" />下载
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

export default CompDiagTaskReport;
