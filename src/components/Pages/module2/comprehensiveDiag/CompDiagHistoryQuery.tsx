'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, Calendar, Clock, User,
  CheckCircle2, XCircle, Server, Database, Network, BarChart3, FileText,
  ChevronDown, ChevronRight, AlertCircle, ListTree, ArrowRight, Shield
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface HistoryRecord {
  id: string;
  name: string;
  category: '网络' | '数据库' | '应用' | '存储' | '安全' | '硬件';
  startTime: string;
  endTime: string;
  duration: string;
  status: 'success' | 'partial' | 'failed';
  rootCause: string;
  affectedNodes: number;
  executor: string;
  confidence: number;
  businessImpact: string;
  fixMethod: string;
  improvement: number;
}

const records: HistoryRecord[] = [
  { id: 'CDH-99832', name: '生产数据库连接池耗尽', category: '数据库', startTime: '2026-06-03 10:45:18', endTime: '2026-06-03 11:32:00', duration: '00:46:42', status: 'success', rootCause: '连接池 max=100，突发 150 并发排队', affectedNodes: 4, executor: '王芳', confidence: 94, businessImpact: '交易延迟 8s，10% 支付失败', fixMethod: '连接池扩容到 200 + 限流', improvement: 2 },
  { id: 'CDH-99831', name: 'Web 集群 CPU 95%', category: '应用', startTime: '2026-06-03 10:12:00', endTime: '2026-06-03 11:48:00', duration: '01:36:00', status: 'partial', rootCause: 'Tomcat 线程死锁', affectedNodes: 2, executor: '陈磊', confidence: 88, businessImpact: '页面加载 3-5s', fixMethod: '线程池重启 + JVM 调优', improvement: 3 },
  { id: 'CDH-99830', name: '存储 IO 延迟突增', category: '存储', startTime: '2026-06-03 08:30:00', endTime: '2026-06-03 09:45:00', duration: '01:15:00', status: 'success', rootCause: '存储控制器缓存模块异常', affectedNodes: 3, executor: '刘洋', confidence: 92, businessImpact: '业务恢复', fixMethod: '缓存模块重启 + 备件更换', improvement: 1 },
  { id: 'CDH-99829', name: '网络抖动', category: '网络', startTime: '2026-06-02 22:15:00', endTime: '2026-06-02 22:48:00', duration: '00:33:00', status: 'success', rootCause: 'BGP 路由收敛', affectedNodes: 2, executor: '李娜', confidence: 86, businessImpact: '5% API 超时', fixMethod: 'BFD 加速 + 路由优化', improvement: 2 },
  { id: 'CDH-99828', name: 'MQ 消息堆积', category: '应用', startTime: '2026-06-02 18:00:00', endTime: '2026-06-02 19:30:00', duration: '01:30:00', status: 'success', rootCause: '消费者停止消费', affectedNodes: 3, executor: '陈磊', confidence: 90, businessImpact: '短信延迟 30min', fixMethod: '消费者重启 + 自动伸缩', improvement: 1 },
  { id: 'CDH-99827', name: '防火墙会话表满', category: '安全', startTime: '2026-06-02 16:30:00', endTime: '2026-06-02 17:15:00', duration: '00:45:00', status: 'success', rootCause: '会话表容量上限', affectedNodes: 1, executor: '李娜', confidence: 95, businessImpact: '10% 新建连接失败', fixMethod: '调整超时 + 表扩容', improvement: 1 },
  { id: 'CDH-99826', name: 'K8s Pod OOMKilled', category: '应用', startTime: '2026-06-01 14:00:00', endTime: '2026-06-01 14:25:00', duration: '00:25:00', status: 'success', rootCause: 'JVM 堆内存不足', affectedNodes: 5, executor: '陈磊', confidence: 92, businessImpact: 'Pod 重启 3 次', fixMethod: '内存限制 4G→6G', improvement: 1 },
  { id: 'CDH-99825', name: '数据库主从延迟', category: '数据库', startTime: '2026-05-31 10:00:00', endTime: '2026-05-31 12:30:00', duration: '02:30:00', status: 'partial', rootCause: '大事务 + 慢 SQL', affectedNodes: 2, executor: '王芳', confidence: 85, businessImpact: '从库延迟 15s', fixMethod: '拆分大事务 + SQL 优化', improvement: 4 },
  { id: 'CDH-99824', name: '交换机端口错包', category: '网络', startTime: '2026-05-30 08:00:00', endTime: '2026-05-30 08:45:00', duration: '00:45:00', status: 'success', rootCause: '端口协商不匹配', affectedNodes: 1, executor: '李娜', confidence: 88, businessImpact: '部分业务丢包', fixMethod: '强制速率 + 双工模式', improvement: 1 },
  { id: 'CDH-99823', name: 'CDN 节点异常', category: '网络', startTime: '2026-05-29 16:00:00', endTime: '2026-05-29 17:00:00', duration: '01:00:00', status: 'success', rootCause: 'CDN 边缘节点宕机', affectedNodes: 3, executor: '李娜', confidence: 90, businessImpact: '静态资源加载慢', fixMethod: '流量切换到健康节点', improvement: 0 },
];

const statusConfig = {
  success: { label: '已解决', color: 'text-green-400', bg: 'bg-green-500/20' },
  partial: { label: '部分解决', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  failed: { label: '未解决', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const categoryColor: Record<HistoryRecord['category'], string> = {
  网络: '#06B6D4',
  数据库: '#22C55E',
  应用: '#FF6D00',
  存储: '#9333EA',
  安全: '#EF4444',
  硬件: '#EAB308',
};

// 月度统计
const monthlyData = [
  { month: '1月', count: 28, success: 24, avgDuration: 65 },
  { month: '2月', count: 25, success: 22, avgDuration: 58 },
  { month: '3月', count: 32, success: 28, avgDuration: 52 },
  { month: '4月', count: 30, success: 27, avgDuration: 48 },
  { month: '5月', count: 35, success: 32, avgDuration: 45 },
  { month: '6月', count: 18, success: 17, avgDuration: 42 },
];

// 分类分布
const categoryDist = [
  { name: '数据库', value: 28, color: '#22C55E' },
  { name: '应用', value: 35, color: '#FF6D00' },
  { name: '网络', value: 22, color: '#06B6D4' },
  { name: '存储', value: 15, color: '#9333EA' },
  { name: '安全', value: 8, color: '#EF4444' },
  { name: '硬件', value: 5, color: '#EAB308' },
];

export function CompDiagHistoryQuery() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('CDH-99832');
  const [dateRange, setDateRange] = useState('7d');

  const filtered = records.filter(r => {
    if (search && !r.name.includes(search) && !r.id.includes(search)) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const selected = selectedId ? records.find(r => r.id === selectedId) : null;
  const stats = {
    total: records.length,
    success: records.filter(r => r.status === 'success').length,
    partial: records.filter(r => r.status === 'partial').length,
    failed: records.filter(r => r.status === 'failed').length,
    successRate: ((records.filter(r => r.status !== 'failed').length / records.length) * 100).toFixed(1),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="历史记录" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="已解决" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="部分解决" value={stats.partial} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="未解决" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="解决率" value={`${stats.successRate}%`} color="#9333EA" icon={<Shield className="w-4 h-4" />} />
      </div>

      {/* 月度趋势 + 分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">月度诊断统计</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Bar dataKey="success" stackId="a" fill="#22C55E" name="已解决" />
              <Bar dataKey="count" stackId="b" fill="#0066FF" fillOpacity={0.3} name="总数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">分类分布</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={categoryDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45}>
                {categoryDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {categoryDist.map(d => (
              <div key={d.name} className="flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded" style={{ background: d.color }} />
                <span className="text-slate-400 flex-1">{d.name}</span>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断任务历史查询</h2>
            <p className="text-xs text-slate-500 mt-1">历史诊断任务查询、归档、复盘</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
              <option value="24h">最近 24 小时</option>
              <option value="7d">最近 7 天</option>
              <option value="30d">最近 30 天</option>
              <option value="90d">最近 90 天</option>
              <option value="all">全部</option>
            </select>
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
              type="text" placeholder="搜索记录/ID/根因"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">历史记录 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(r => {
              const sc = statusConfig[r.status];
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[r.category]}20`, color: categoryColor[r.category] }}>{r.category}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{r.duration}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1.5">根因: {r.rootCause}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{r.executor}</span>
                    <span>·</span>
                    <span>节点 {r.affectedNodes}</span>
                    <span>·</span>
                    <span>置信度 <span className="text-blue-300 font-mono">{r.confidence}%</span></span>
                    <span>·</span>
                    <span>改进 {r.improvement} 项</span>
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
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColor[selected.category]}20`, color: categoryColor[selected.category] }}>{selected.category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>{statusConfig[selected.status].label}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">结束</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.endTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">耗时</div>
                <div className="text-blue-300 font-mono">{selected.duration}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">执行人</div>
                <div className="text-yellow-300">{selected.executor}</div>
              </div>
            </div>

            <div className="bg-[#111625] border border-red-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">根因分析</div>
              <div className="text-xs text-red-300">{selected.rootCause}</div>
            </div>

            <div className="bg-[#111625] border border-orange-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">业务影响</div>
              <div className="text-xs text-orange-300">{selected.businessImpact}</div>
            </div>

            <div className="bg-[#111625] border border-green-500/30 rounded p-2">
              <div className="text-[10px] text-slate-500 mb-0.5">解决方法</div>
              <div className="text-xs text-green-300">{selected.fixMethod}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">节点数</div>
                <div className="text-lg font-bold text-blue-300">{selected.affectedNodes}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">置信度</div>
                <div className="text-lg font-bold text-purple-300">{selected.confidence}%</div>
              </div>
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-[10px] text-slate-400">改进项</div>
                <div className="text-lg font-bold text-green-300">{selected.improvement}</div>
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md flex items-center justify-center gap-1.5">
              <Eye className="w-3 h-3" />查看完整报告
            </button>
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

export default CompDiagHistoryQuery;
