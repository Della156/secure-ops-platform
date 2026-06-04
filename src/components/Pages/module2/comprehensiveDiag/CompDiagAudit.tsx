'use client';

import React, { useState } from 'react';
import {
  Search, Download, RefreshCw, Filter, Eye, Calendar, Clock, User,
  Shield, CheckCircle2, XCircle, AlertCircle, FileText, ListTree, Activity,
  Lock, Unlock, Database, Server, ChevronRight, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: '登录' | '查询' | '创建' | '编辑' | '删除' | '执行' | '授权' | '导出' | '审批';
  resource: string;
  resourceId: string;
  result: 'success' | 'failed' | 'warning';
  ip: string;
  device: string;
  risk: 'low' | 'medium' | 'high';
  detail: string;
}

const logs: AuditLog[] = [
  { id: 'AL-99821', timestamp: '2026-06-03 11:32:00', user: '王芳', userRole: 'DBA', action: '执行', resource: '生产数据库连接池诊断', resourceId: 'CDH-99832', result: 'success', ip: '10.0.5.12', device: 'Mac/Chrome', risk: 'low', detail: '执行诊断任务，连接池扩容 100→200' },
  { id: 'AL-99820', timestamp: '2026-06-03 11:25:18', user: '陈磊', userRole: '运维工程师', action: '创建', resource: 'Web 集群 CPU 诊断任务', resourceId: 'CD-M-99820', result: 'success', ip: '10.0.5.18', device: 'Windows/Edge', risk: 'low', detail: '创建新的诊断任务' },
  { id: 'AL-99819', timestamp: '2026-06-03 11:18:00', user: 'system', userRole: '系统', action: '查询', resource: '存储 LUN-12 资源', resourceId: 'N-009', result: 'warning', ip: '127.0.0.1', device: 'Internal', risk: 'medium', detail: '自动巡检发现磁盘使用率 92%' },
  { id: 'AL-99818', timestamp: '2026-06-03 10:48:30', user: '李娜', userRole: '网络工程师', action: '编辑', resource: '防火墙会话表配置', resourceId: 'FW-EDGE-01', result: 'success', ip: '10.0.5.22', device: 'Windows/Chrome', risk: 'medium', detail: '修改会话超时时间 1800→3600' },
  { id: 'AL-99817', timestamp: '2026-06-03 10:32:15', user: '王芳', userRole: 'DBA', action: '授权', resource: '生产数据库慢查询', resourceId: 'DB-Oracle-Prod', result: 'success', ip: '10.0.5.12', device: 'Mac/Chrome', risk: 'low', detail: '授权陈磊查看生产库慢查询' },
  { id: 'AL-99816', timestamp: '2026-06-03 10:15:42', user: 'admin', userRole: '管理员', action: '导出', resource: '全量诊断报告', resourceId: 'BATCH-99815', result: 'success', ip: '10.0.5.5', device: 'Windows/Chrome', risk: 'low', detail: '导出 5 月全量诊断报告 PDF' },
  { id: 'AL-99815', timestamp: '2026-06-03 09:48:00', user: 'unknown', userRole: '未知', action: '登录', resource: '系统登录', resourceId: 'AUTH-99814', result: 'failed', ip: '203.0.113.45', device: 'Linux/Curl', risk: 'high', detail: '异地异常登录，密码错误 5 次' },
  { id: 'AL-99814', timestamp: '2026-06-03 09:32:18', user: '刘洋', userRole: '系统工程师', action: '审批', resource: '存储 IO 诊断任务', resourceId: 'CDH-99830', result: 'success', ip: '10.0.5.20', device: 'Mac/Safari', risk: 'low', detail: '审批同意执行存储 IO 诊断' },
  { id: 'AL-99813', timestamp: '2026-06-03 09:15:00', user: '陈磊', userRole: '运维工程师', action: '查询', resource: 'K8s 集群状态', resourceId: 'K8s-Cluster-Prod', result: 'success', ip: '10.0.5.18', device: 'Windows/Edge', risk: 'low', detail: '查询 K8s 集群节点状态' },
  { id: 'AL-99812', timestamp: '2026-06-02 22:48:00', user: '李娜', userRole: '网络工程师', action: '执行', resource: 'BGP 路由优化', resourceId: 'NET-99811', result: 'success', ip: '10.0.5.22', device: 'Windows/Chrome', risk: 'medium', detail: '执行 BGP 路由优化，调整本地优先级' },
  { id: 'AL-99811', timestamp: '2026-06-02 19:30:00', user: 'system', userRole: '系统', action: '执行', resource: 'MQ 消费者自动伸缩', resourceId: 'MQ-AUTO-99810', result: 'success', ip: '127.0.0.1', device: 'Internal', risk: 'low', detail: '自动扩容消费者 5→10 实例' },
  { id: 'AL-99810', timestamp: '2026-06-02 18:00:00', user: '陈磊', userRole: '运维工程师', action: '执行', resource: 'ActiveMQ 重启', resourceId: 'MQ-ActiveMQ-Prod', result: 'success', ip: '10.0.5.18', device: 'Windows/Edge', risk: 'high', detail: '重启 ActiveMQ 服务，停止 5 分钟' },
  { id: 'AL-99809', timestamp: '2026-06-02 17:00:00', user: '王芳', userRole: 'DBA', action: '删除', resource: '临时诊断数据', resourceId: 'TMP-DATA-99808', result: 'success', ip: '10.0.5.12', device: 'Mac/Chrome', risk: 'low', detail: '删除 30 天前临时诊断数据' },
  { id: 'AL-99808', timestamp: '2026-06-02 16:30:00', user: '李娜', userRole: '网络工程师', action: '编辑', resource: '防火墙会话表', resourceId: 'FW-EDGE-01', result: 'success', ip: '10.0.5.22', device: 'Windows/Chrome', risk: 'medium', detail: '会话表容量从 100k 扩容到 200k' },
];

const actionColor: Record<AuditLog['action'], string> = {
  登录: 'bg-blue-500/20 text-blue-400',
  查询: 'bg-slate-500/20 text-slate-400',
  创建: 'bg-green-500/20 text-green-400',
  编辑: 'bg-yellow-500/20 text-yellow-400',
  删除: 'bg-red-500/20 text-red-400',
  执行: 'bg-purple-500/20 text-purple-400',
  授权: 'bg-cyan-500/20 text-cyan-400',
  导出: 'bg-orange-500/20 text-orange-400',
  审批: 'bg-pink-500/20 text-pink-400',
};

const resultConfig = {
  success: { label: '成功', color: 'text-green-400' },
  failed: { label: '失败', color: 'text-red-400' },
  warning: { label: '警告', color: 'text-yellow-400' },
};

const riskColor: Record<AuditLog['risk'], string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  high: 'bg-red-500/20 text-red-400 border-red-500/40',
};

// 审计统计
const auditTrend = [
  { hour: '00', count: 5 },
  { hour: '02', count: 8 },
  { hour: '04', count: 12 },
  { hour: '06', count: 15 },
  { hour: '08', count: 28 },
  { hour: '10', count: 45 },
  { hour: '12', count: 38 },
  { hour: '14', count: 42 },
  { hour: '16', count: 35 },
  { hour: '18', count: 22 },
  { hour: '20', count: 12 },
  { hour: '22', count: 8 },
];

// 操作类型分布
const actionDist = [
  { action: '查询', count: 458, color: '#94A3B8' },
  { action: '执行', count: 156, color: '#9333EA' },
  { action: '编辑', count: 89, color: '#EAB308' },
  { action: '创建', count: 67, color: '#22C55E' },
  { action: '登录', count: 45, color: '#0066FF' },
  { action: '导出', count: 32, color: '#FF6D00' },
  { action: '授权', count: 28, color: '#06B6D4' },
  { action: '审批', count: 18, color: '#EC4899' },
  { action: '删除', count: 12, color: '#EF4444' },
];

export function CompDiagAudit() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('AL-99821');

  const filtered = logs.filter(l => {
    if (search && !l.user.includes(search) && !l.resource.includes(search) && !l.id.includes(search)) return false;
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (resultFilter !== 'all' && l.result !== resultFilter) return false;
    if (riskFilter !== 'all' && l.risk !== riskFilter) return false;
    return true;
  });

  const selected = selectedId ? logs.find(l => l.id === selectedId) : null;
  const stats = {
    total: logs.length,
    success: logs.filter(l => l.result === 'success').length,
    failed: logs.filter(l => l.result === 'failed').length,
    high: logs.filter(l => l.risk === 'high').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="审计日志" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="高风险" value={stats.high} color="#FF6D00" icon={<AlertCircle className="w-4 h-4" />} />
      </div>

      {/* 趋势 + 分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">审计操作 24 小时趋势</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={auditTrend}>
              <defs>
                <linearGradient id="auditGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="count" stroke="#0066FF" fill="url(#auditGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">操作类型分布</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {actionDist.map(a => (
              <div key={a.action} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-8">{a.action}</span>
                <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(a.count / 500) * 100}%`, background: a.color }} />
                </div>
                <span className="text-[10px] text-slate-300 font-mono w-8 text-right">{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">综合故障诊断任务审计</h2>
            <p className="text-xs text-slate-500 mt-1">所有诊断操作日志、用户行为审计、合规检查</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出审计
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索用户/资源/ID"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部操作</option>
            <option value="登录">登录</option>
            <option value="查询">查询</option>
            <option value="创建">创建</option>
            <option value="编辑">编辑</option>
            <option value="删除">删除</option>
            <option value="执行">执行</option>
            <option value="授权">授权</option>
            <option value="导出">导出</option>
            <option value="审批">审批</option>
          </select>
          <select value={resultFilter} onChange={e => setResultFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
            <option value="warning">警告</option>
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部风险</option>
            <option value="low">低风险</option>
            <option value="medium">中风险</option>
            <option value="high">高风险</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]">
            <h3 className="text-sm font-semibold text-white">审计日志 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(l => {
              const rc = resultConfig[l.result];
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === l.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{l.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${actionColor[l.action]}`}>{l.action}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.color}`}>{rc.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[l.risk]}`}>{l.risk === 'low' ? '低' : l.risk === 'medium' ? '中' : '高'}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{l.timestamp.split(' ')[1]}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{l.resource}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1.5">{l.detail}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{l.user} · {l.userRole}</span>
                    <span>·</span>
                    <span className="font-mono">{l.ip}</span>
                    <span>·</span>
                    <span>{l.device}</span>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${actionColor[selected.action]}`}>{selected.action}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selected.result].color}`}>{resultConfig[selected.result].label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[selected.risk]}`}>{selected.risk === 'low' ? '低风险' : selected.risk === 'medium' ? '中风险' : '高风险'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.resource}</h3>
              <p className="text-xs text-slate-400">{selected.detail}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.timestamp}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">资源ID</div>
                <div className="text-blue-300 font-mono text-[10px]">{selected.resourceId}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">用户</div>
                <div className="text-yellow-300">{selected.user}</div>
                <div className="text-[10px] text-slate-500">{selected.userRole}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">设备</div>
                <div className="text-slate-200 text-[10px]">{selected.device}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 col-span-2">
                <div className="text-slate-500 mb-0.5">IP 地址</div>
                <div className="text-purple-300 font-mono text-[10px]">{selected.ip}</div>
              </div>
            </div>

            {selected.risk === 'high' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs">
                <div className="flex items-center gap-1.5 text-red-300 font-medium mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />高风险操作
                </div>
                <div className="text-[10px] text-slate-400">该操作触发安全审计规则，建议人工核实操作者身份。</div>
              </div>
            )}

            <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md flex items-center justify-center gap-1.5">
              <Eye className="w-3 h-3" />查看完整审计
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

export default CompDiagAudit;
