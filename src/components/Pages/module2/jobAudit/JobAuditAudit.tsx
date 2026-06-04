'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Filter, Eye, Calendar, User, Shield, CheckCircle2, XCircle, AlertCircle, FileText, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AuditLog {
  id: string; timestamp: string; user: string; userRole: string;
  action: '提交' | '审核' | '批准' | '驳回' | '转交' | '加签' | '撤回' | '执行' | '查看' | '导出';
  resource: string; resourceId: string; result: 'success' | 'failed' | 'warning';
  ip: string; device: string; risk: 'low' | 'medium' | 'high';
  detail: string; previous?: string; current?: string;
}

const logs: AuditLog[] = [
  { id: 'JA-AL-99821', timestamp: '2026-06-03 12:00:18', user: 'CISO', userRole: '安全总监', action: '批准', resource: '生产防火墙策略变更', resourceId: 'JA-99831', result: 'success', ip: '10.0.5.5', device: 'Mac/Safari', risk: 'medium', detail: '批准策略变更，需 2 小时内完成', previous: 'pending', current: 'approved' },
  { id: 'JA-AL-99820', timestamp: '2026-06-03 11:48:00', user: '张伟', userRole: '运维主管', action: '审核', resource: '生产防火墙策略变更', resourceId: 'JA-99831', result: 'success', ip: '10.0.5.10', device: 'Windows/Chrome', risk: 'low', detail: '人工复核通过，提交 CISO 批准', previous: 'reviewing', current: 'reviewing' },
  { id: 'JA-AL-99819', timestamp: '2026-06-03 11:25:00', user: '李娜', userRole: '网络工程师', action: '提交', resource: '生产防火墙策略变更', resourceId: 'JA-99831', result: 'success', ip: '10.0.5.22', device: 'Windows/Chrome', risk: 'low', detail: '提交策略变更申请', previous: '-', current: 'pending' },
  { id: 'JA-AL-99818', timestamp: '2026-06-03 11:12:00', user: 'AI', userRole: 'AI 自动', action: '批准', resource: 'Oracle 表结构变更', resourceId: 'JA-99830', result: 'success', ip: '127.0.0.1', device: 'Internal', risk: 'medium', detail: 'AI 自动审核通过 (88 分)，CISO 已批', previous: 'reviewing', current: 'approved' },
  { id: 'JA-AL-99817', timestamp: '2026-06-03 11:00:00', user: 'CISO', userRole: '安全总监', action: '审核', resource: 'Oracle 表结构变更', resourceId: 'JA-99830', result: 'success', ip: '10.0.5.5', device: 'Mac/Safari', risk: 'medium', detail: '高风险作业，重点复核', previous: 'reviewing', current: 'reviewing' },
  { id: 'JA-AL-99816', timestamp: '2026-06-03 10:48:18', user: '王芳', userRole: 'DBA', action: '提交', resource: 'Oracle 表结构变更', resourceId: 'JA-99830', result: 'success', ip: '10.0.5.12', device: 'Mac/Chrome', risk: 'high', detail: '提交表结构变更申请（高风险）', previous: '-', current: 'pending' },
  { id: 'JA-AL-99815', timestamp: '2026-06-03 10:15:00', user: '运维总监', userRole: '运维总监', action: '批准', resource: 'Web 集群补丁安装', resourceId: 'JA-99829', result: 'success', ip: '10.0.5.8', device: 'Windows/Edge', risk: 'medium', detail: '批准批量补丁安装', previous: 'reviewing', current: 'approved' },
  { id: 'JA-AL-99814', timestamp: '2026-06-03 10:00:00', user: '李娜', userRole: '网络工程师', action: '加签', resource: 'Web 集群补丁安装', resourceId: 'JA-99829', result: 'success', ip: '10.0.5.22', device: 'Windows/Chrome', risk: 'low', detail: '加签运维总监审批' },
  { id: 'JA-AL-99813', timestamp: '2026-06-03 09:32:00', user: '陈磊', userRole: '运维工程师', action: '提交', resource: 'Web 集群补丁安装', resourceId: 'JA-99829', result: 'success', ip: '10.0.5.18', device: 'Windows/Edge', risk: 'medium', detail: '提交批量补丁申请' },
  { id: 'JA-AL-99812', timestamp: '2026-06-02 23:20:00', user: '陈磊', userRole: '运维工程师', action: '驳回', resource: '生产慢 SQL 优化', resourceId: 'JA-99827', result: 'success', ip: '10.0.5.18', device: 'Windows/Edge', risk: 'medium', detail: '驳回：包含 DROP INDEX 风险操作', previous: 'reviewing', current: 'rejected' },
  { id: 'JA-AL-99811', timestamp: '2026-06-02 22:48:00', user: '王芳', userRole: 'DBA', action: '提交', resource: '生产慢 SQL 优化', resourceId: 'JA-99827', result: 'success', ip: '10.0.5.12', device: 'Mac/Chrome', risk: 'medium', detail: '提交慢 SQL 优化申请' },
  { id: 'JA-AL-99810', timestamp: '2026-06-02 18:38:00', user: 'AI', userRole: 'AI 紧急', action: '批准', resource: 'APT 应急处置', resourceId: 'JA-99826', result: 'success', ip: '127.0.0.1', device: 'Internal', risk: 'high', detail: 'AI 紧急通道自动批准（应急场景）' },
  { id: 'JA-AL-99809', timestamp: '2026-06-02 18:30:00', user: '张伟', userRole: '安全部', action: '提交', resource: 'APT 应急处置', resourceId: 'JA-99826', result: 'success', ip: '10.0.5.15', device: 'Windows/Chrome', risk: 'high', detail: '紧急 APT 处置申请' },
  { id: 'JA-AL-99808', timestamp: '2026-06-02 16:30:00', user: 'unknown', userRole: '未知', action: '查看', resource: '审核任务列表', resourceId: 'JA-*', result: 'failed', ip: '203.0.113.45', device: 'Linux/Curl', risk: 'high', detail: '异常 IP 访问审核列表被拒', previous: '-', current: 'blocked' },
];

const actionColor: Record<AuditLog['action'], string> = {
  '提交': 'bg-blue-500/20 text-blue-400',
  '审核': 'bg-purple-500/20 text-purple-400',
  '批准': 'bg-green-500/20 text-green-400',
  '驳回': 'bg-red-500/20 text-red-400',
  '转交': 'bg-yellow-500/20 text-yellow-400',
  '加签': 'bg-cyan-500/20 text-cyan-400',
  '撤回': 'bg-orange-500/20 text-orange-400',
  '执行': 'bg-pink-500/20 text-pink-400',
  '查看': 'bg-slate-500/20 text-slate-400',
  '导出': 'bg-indigo-500/20 text-indigo-400',
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

const trend = [
  { hour: '00', count: 2 }, { hour: '02', count: 1 }, { hour: '04', count: 0 },
  { hour: '06', count: 3 }, { hour: '08', count: 8 }, { hour: '10', count: 18 },
  { hour: '12', count: 12 }, { hour: '14', count: 15 }, { hour: '16', count: 22 },
  { hour: '18', count: 16 }, { hour: '20', count: 8 }, { hour: '22', count: 4 },
];

const actionDist = [
  { action: '提交', count: 142, color: '#0066FF' },
  { action: '审核', count: 89, color: '#9333EA' },
  { action: '批准', count: 124, color: '#22C55E' },
  { action: '驳回', count: 18, color: '#EF4444' },
  { action: '加签', count: 32, color: '#06B6D4' },
  { action: '转交', count: 8, color: '#EAB308' },
  { action: '执行', count: 142, color: '#EC4899' },
  { action: '撤回', count: 5, color: '#FF6D00' },
];

export function JobAuditAudit() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('JA-AL-99821');

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">审计操作 24 小时趋势</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="auditG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} /><stop offset="95%" stopColor="#0066FF" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
              <Area type="monotone" dataKey="count" stroke="#0066FF" fill="url(#auditG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">操作类型分布</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {actionDist.map(a => (
              <div key={a.action} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-10">{a.action}</span>
                <div className="flex-1 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(a.count / 150) * 100}%`, background: a.color }} />
                </div>
                <span className="text-[10px] text-slate-300 font-mono w-8 text-right">{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">作业审核任务审计</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="搜索用户/资源/ID" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none" />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部操作</option>
            <option value="提交">提交</option><option value="审核">审核</option><option value="批准">批准</option>
            <option value="驳回">驳回</option><option value="加签">加签</option><option value="转交">转交</option>
            <option value="撤回">撤回</option><option value="执行">执行</option>
          </select>
          <select value={resultFilter} onChange={e => setResultFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option><option value="success">成功</option><option value="failed">失败</option>
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部风险</option><option value="low">低</option><option value="medium">中</option><option value="high">高</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D]"><h3 className="text-sm font-semibold text-white">审计日志 ({filtered.length})</h3></div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(l => {
              const rc = resultConfig[l.result];
              return (
                <div key={l.id} onClick={() => setSelectedId(l.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === l.id ? 'bg-[#111625]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{l.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${actionColor[l.action]}`}>{l.action}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.color}`}>{rc.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[l.risk]}`}>{l.risk === 'low' ? '低' : l.risk === 'medium' ? '中' : '高'}</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500 font-mono">{l.timestamp.split(' ')[1]}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{l.resource}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mb-1">{l.detail}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span><User className="w-2.5 h-2.5 inline mr-0.5" />{l.user} · {l.userRole}</span>
                    <span>·</span>
                    <span className="font-mono">{l.ip}</span>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${actionColor[selected.action]}`}>{selected.action}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selected.result].color}`}>{resultConfig[selected.result].label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${riskColor[selected.risk]}`}>{selected.risk === 'low' ? '低风险' : selected.risk === 'medium' ? '中风险' : '高风险'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.resource}</h3>
              <p className="text-xs text-slate-400">{selected.detail}</p>
            </div>

            {selected.previous && selected.current && (
              <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
                <div className="text-[10px] text-slate-500 mb-1">状态变更</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-orange-300 font-mono">{selected.previous}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-green-300 font-mono">{selected.current}</span>
                </div>
              </div>
            )}

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
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">角色</div>
                <div className="text-slate-200 text-[10px]">{selected.userRole}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 col-span-2">
                <div className="text-slate-500 mb-0.5">IP / 设备</div>
                <div className="text-purple-300 font-mono text-[10px]">{selected.ip} · {selected.device}</div>
              </div>
            </div>

            {selected.risk === 'high' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs">
                <div className="flex items-center gap-1.5 text-red-300 font-medium mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />高风险操作
                </div>
                <div className="text-[10px] text-slate-400">该操作触发安全审计规则，建议人工核实。</div>
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

export default JobAuditAudit;
