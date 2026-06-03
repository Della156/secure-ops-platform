'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download, RefreshCw, Shield, AlertCircle, Clock,
  CheckCircle2, XCircle, Zap, Activity, ChevronRight, Filter,
  User, Calendar, Key, FileText, Eye, Edit, Trash2, Power,
  Server, Database, Network, Lock, Unlock, ArrowRight, Award,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface PreAuth {
  id: string;
  name: string;
  operation: string;
  scope: '特定资产' | '特定告警类型' | '特定子网' | '全局';
  triggerCondition: string;
  maxActions: number;
  usedActions: number;
  validity: { from: string; to: string };
  approver: string;
  approverRole: string;
  emergencyLevel: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'active' | 'paused' | 'expired' | 'revoked';
  lastUsed: string;
  usedCount: number;
  cooldown: number; // 分钟
  description: string;
}

const preauths: PreAuth[] = [
  { id: 'PA-001', name: '挖矿木马自动隔离授权', operation: '隔离主机 + 杀进程 + 杀文件', scope: '特定告警类型', triggerCondition: 'EDR 检测到挖矿类威胁且置信度 ≥ 95%', maxActions: 20, usedActions: 8, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: '安全总监', approverRole: 'CISO', emergencyLevel: 'P1', status: 'active', lastUsed: '2 小时前', usedCount: 156, cooldown: 30, description: '针对高置信度挖矿告警自动执行完整处置流程' },
  { id: 'PA-002', name: '钓鱼邮件批量删除授权', operation: '删除邮件 + 重置密码 + 扫描终端', scope: '特定告警类型', triggerCondition: '邮件安全检测到钓鱼特征且发件人为外部', maxActions: 500, usedActions: 142, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: '安全总监', approverRole: 'CISO', emergencyLevel: 'P2', status: 'active', lastUsed: '4 小时前', usedCount: 28, cooldown: 10, description: '针对已确认钓鱼邮件的批量删除与重置' },
  { id: 'PA-003', name: 'APT 高置信度自动隔离', operation: '隔离主机 + 收集证据 + 暂停账号', scope: '特定告警类型', triggerCondition: 'APT 家族命中 + 行为链 ≥ 5 步 + 置信度 ≥ 90%', maxActions: 10, usedActions: 2, validity: { from: '2026-03-01', to: '2026-09-01' }, approver: '安全总监', approverRole: 'CISO', emergencyLevel: 'P0', status: 'active', lastUsed: '3 天前', usedCount: 5, cooldown: 60, description: '针对高置信度 APT 攻击的紧急隔离' },
  { id: 'PA-004', name: '核心交换机 ACL 应急变更', operation: '修改 ACL + 配置备份', scope: '特定子网', triggerCondition: '边界安全告警需要紧急封禁', maxActions: 50, usedActions: 12, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: '网络总监', approverRole: 'Network Director', emergencyLevel: 'P1', status: 'active', lastUsed: '昨天', usedCount: 84, cooldown: 15, description: '边界安全告警触发的 ACL 紧急变更' },
  { id: 'PA-005', name: '数据库紧急封禁 IP', operation: '数据库防火墙规则', scope: '特定资产', triggerCondition: '数据库暴力破解告警', maxActions: 100, usedActions: 45, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: 'DBA 主管', approverRole: 'DBA Manager', emergencyLevel: 'P1', status: 'active', lastUsed: '1 小时前', usedCount: 245, cooldown: 5, description: '数据库暴力破解时的 IP 紧急封禁' },
  { id: 'PA-006', name: 'Webshell 自动隔离', operation: '隔离主机 + 备份文件', scope: '特定告警类型', triggerCondition: 'WAF + EDR 联合检测到 Webshell', maxActions: 30, usedActions: 18, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: '安全总监', approverRole: 'CISO', emergencyLevel: 'P0', status: 'active', lastUsed: '30 分钟前', usedCount: 67, cooldown: 20, description: 'Webshell 上传的紧急隔离与取证' },
  { id: 'PA-007', name: '勒索软件爆发应急', operation: '全网断网 + 关键系统备份', scope: '全局', triggerCondition: '≥ 3 台主机同时检测到勒索行为', maxActions: 5, usedActions: 0, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: 'CIO + CISO', approverRole: 'CIO+CISO', emergencyLevel: 'P0', status: 'active', lastUsed: '未使用', usedCount: 0, cooldown: 1440, description: '勒索软件大规模爆发的全网断网应急' },
  { id: 'PA-008', name: 'DDoS 自动牵引', operation: '流量牵引 + 清洗 + 回注', scope: '全局', triggerCondition: '入向流量突增 5 倍以上', maxActions: 100, usedActions: 12, validity: { from: '2026-01-01', to: '2026-12-31' }, approver: '安全总监', approverRole: 'CISO', emergencyLevel: 'P1', status: 'active', lastUsed: '2 天前', usedCount: 23, cooldown: 60, description: 'DDoS 攻击的自动流量牵引与清洗' },
  { id: 'PA-009', name: '测试环境预授权（已过期）', operation: '全操作', scope: '全局', triggerCondition: '任意', maxActions: 1000, usedActions: 234, validity: { from: '2026-01-01', to: '2026-03-01' }, approver: '测试经理', approverRole: 'Test Manager', emergencyLevel: 'P3', status: 'expired', lastUsed: '3 个月前', usedCount: 234, cooldown: 0, description: '测试环境的全操作预授权（已过期）' },
];

const levelColor: Record<PreAuth['emergencyLevel'], string> = {
  P0: 'bg-red-500/20 text-red-400 border-red-500/40',
  P1: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  P2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  P3: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

const statusConfig = {
  active: { label: '生效中', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  paused: { label: '已暂停', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <Pause className="w-3 h-3" /> },
  expired: { label: '已过期', color: 'text-slate-500', bg: 'bg-slate-500/20', icon: <Clock className="w-3 h-3" /> },
  revoked: { label: '已撤销', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
};

const usageTrend = [
  { day: '05-28', count: 18 },
  { day: '05-29', count: 22 },
  { day: '05-30', count: 15 },
  { day: '05-31', count: 28 },
  { day: '06-01', count: 35 },
  { day: '06-02', count: 42 },
  { day: '06-03', count: 24 },
];

export function PreAuthorizedEmergencyExec() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('PA-001');

  const filtered = preauths.filter(p => {
    if (search && !p.name.includes(search) && !p.operation.includes(search)) return false;
    if (levelFilter !== 'all' && p.emergencyLevel !== levelFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? preauths.find(p => p.id === selectedId) : null;
  const stats = {
    total: preauths.length,
    active: preauths.filter(p => p.status === 'active').length,
    usedToday: preauths.reduce((s, p) => s + p.usedActions, 0),
    totalCapacity: preauths.reduce((s, p) => s + p.maxActions, 0),
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="预授权总数" value={stats.total} color="#0066FF" icon={<Award className="w-4 h-4" />} />
        <StatBox label="生效中" value={stats.active} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="今日已用" value={stats.usedToday} color="#FF6D00" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="总配额" value={stats.totalCapacity} color="#9333EA" icon={<Shield className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">预授权应急处置执行</h2>
            <p className="text-xs text-slate-500 mt-1">预先审批的应急操作授权，应对紧急安全事件（挖掘/P0/P1 高危）</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新增预授权
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
              type="text" placeholder="搜索名称/操作"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部等级</option>
            <option value="P0">P0 紧急</option>
            <option value="P1">P1 高</option>
            <option value="P2">P2 中</option>
            <option value="P3">P3 低</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="active">生效中</option>
            <option value="paused">已暂停</option>
            <option value="expired">已过期</option>
            <option value="revoked">已撤销</option>
          </select>
        </div>
      </div>

      {/* 使用趋势 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">预授权使用趋势（7 天）</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={usageTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="count" fill="#0066FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 预授权列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">预授权列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(p => {
              const sc = statusConfig[p.status];
              const usagePct = (p.usedActions / p.maxActions) * 100;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === p.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{p.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[p.emergencyLevel]}`}>{p.emergencyLevel}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-500">{p.lastUsed}</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{p.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mb-1.5">{p.operation}</div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>已用 <span className="text-orange-300 font-mono">{p.usedActions}</span> / {p.maxActions}</span>
                    <span>·</span>
                    <span>审批 <span className="text-yellow-300">{p.approver}</span></span>
                    <span>·</span>
                    <span>有效期 {p.validity.from} ~ {p.validity.to}</span>
                  </div>
                  <div className="mt-1.5 h-1 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${usagePct > 80 ? 'bg-red-500' : usagePct > 50 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${usagePct}%` }} />
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
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[selected.emergencyLevel]}`}>{selected.emergencyLevel}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.name}</h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-[10px] text-slate-500 mb-1">操作内容</div>
              <div className="text-xs text-blue-300 font-mono">{selected.operation}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">触发条件</div>
              <div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1.5">
                {selected.triggerCondition}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">范围</div>
                <div className="text-slate-200">{selected.scope}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">冷却时间</div>
                <div className="text-slate-200 font-mono">{selected.cooldown} 分钟</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">审批人</div>
                <div className="text-yellow-300">{selected.approver}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">累计使用</div>
                <div className="text-slate-200 font-mono">{selected.usedCount} 次</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">配额使用</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${(selected.usedActions / selected.maxActions) > 0.8 ? 'bg-red-500' : (selected.usedActions / selected.maxActions) > 0.5 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${(selected.usedActions / selected.maxActions) * 100}%` }} />
                </div>
                <span className="text-xs text-white font-mono">{selected.usedActions}/{selected.maxActions}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {selected.status === 'active' ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md">暂停</button>
                  <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">编辑</button>
                </>
              ) : (
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">续期</button>
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

export default PreAuthorizedEmergencyExec;
