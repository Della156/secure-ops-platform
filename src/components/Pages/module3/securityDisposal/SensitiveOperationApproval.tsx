'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, User,
  AlertCircle, CheckCircle2, Clock, FileText, ArrowRight,
  ThumbsUp, ThumbsDown, MessageSquare, Shield, Lock,
  XCircle, PauseCircle, PlayCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ApprovalTicket {
  id: string;
  operator: string;
  operatorRole: string;
  operation: string;
  operationId: string;
  targetAsset: string;
  targetScope: '单资产' | '子网' | '全网';
  riskLevel: 'high' | 'critical' | 'medium';
  reason: string;
  affectedAssets: number;
  estimatedDuration: string;
  rollbackPlan: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'cancelled';
  submitTime: string;
  approvalTime?: string;
  approver?: string;
  approverComment?: string;
}

const tickets: ApprovalTicket[] = [
  {
    id: 'APP-20260603001',
    operator: '安全工程师 - 李明',
    operatorRole: '安全工程师',
    operation: '冻结域账号 + 强制注销会话',
    operationId: 'OP-010',
    targetAsset: 'user-zhangsan',
    targetScope: '全网',
    riskLevel: 'high',
    reason: '检测到该账号从境外可疑 IP 多次登录，存在账号被盗用风险，需紧急冻结',
    affectedAssets: 1,
    estimatedDuration: '5 分钟',
    rollbackPlan: '如误操作，可通过 AD 管理后台重新启用账号',
    status: 'pending',
    submitTime: '2026-06-03 09:45:00',
  },
  {
    id: 'APP-20260603002',
    operator: 'DBA - 王芳',
    operatorRole: 'DBA',
    operation: '数据库事务回滚（紧急）',
    operationId: 'OP-012',
    targetAsset: '生产主库 - cluster-01',
    targetScope: '数据库',
    riskLevel: 'critical',
    reason: '检测到异常数据修改操作，怀疑 SQL 注入攻击，需要回滚到 09:00 时间点',
    affectedAssets: 5,
    estimatedDuration: '30 分钟',
    rollbackPlan: '回滚前已做全库备份，如有问题可从备份恢复',
    status: 'approved',
    submitTime: '2026-06-03 09:30:00',
    approvalTime: '2026-06-03 09:32:15',
    approver: '业务总监 - 张强',
    approverComment: '同意，请谨慎操作，执行后立即验证',
  },
  {
    id: 'APP-20260602001',
    operator: '网络工程师 - 赵伟',
    operatorRole: '网络工程师',
    operation: '修改边界 ACL 规则（紧急封禁）',
    operationId: 'OP-008',
    targetAsset: '核心边界防火墙',
    targetScope: '全网',
    riskLevel: 'high',
    reason: 'DDoS 攻击正在进行，需紧急封禁攻击源 IP 段',
    affectedAssets: 0,
    estimatedDuration: '2 分钟',
    rollbackPlan: '攻击结束后可删除规则',
    status: 'completed',
    submitTime: '2026-06-02 14:15:00',
    approvalTime: '2026-06-02 14:15:30',
    approver: '网络总监 - 孙强',
    approverComment: '立即执行！',
  },
  {
    id: 'APP-20260601001',
    operator: '安全工程师 - 李明',
    operatorRole: '安全工程师',
    operation: '重启核心服务（可能中断）',
    operationId: 'OP-013',
    targetAsset: '域控服务器',
    targetScope: '全网',
    riskLevel: 'high',
    reason: '发现安全漏洞，需重启服务应用补丁',
    affectedAssets: 100,
    estimatedDuration: '10 分钟',
    rollbackPlan: '如启动失败，可回滚到上一个版本',
    status: 'rejected',
    submitTime: '2026-06-01 18:00:00',
    approvalTime: '2026-06-01 18:02:30',
    approver: '系统负责人 - 周杰',
    approverComment: '请选择非工作时间（凌晨2:00）进行',
  },
];

const statusConfig: Record<ApprovalTicket['status'], { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: '待审批', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <Clock className="w-3 h-3" /> },
  approved: { label: '已批准', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: '已拒绝', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
  executing: { label: '执行中', color: 'text-green-400', bg: 'bg-green-500/20', icon: <PlayCircle className="w-3 h-3" /> },
  completed: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: '已取消', color: 'text-slate-500', bg: 'bg-slate-500/20', icon: <PauseCircle className="w-3 h-3" /> },
};

const riskColor: Record<ApprovalTicket['riskLevel'], string> = {
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
};

const approvalTrend = [
  { day: '05-28', submitted: 8, approved: 7, rejected: 1 },
  { day: '05-29', submitted: 12, approved: 10, rejected: 2 },
  { day: '05-30', submitted: 6, approved: 5, rejected: 1 },
  { day: '05-31', submitted: 15, approved: 12, rejected: 3 },
  { day: '06-01', submitted: 10, approved: 9, rejected: 1 },
  { day: '06-02', submitted: 14, approved: 12, rejected: 2 },
  { day: '06-03', submitted: 5, approved: 3, rejected: 0 },
];

export function SensitiveOperationApproval() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('APP-20260603001');
  const [showNewForm, setShowNewForm] = useState(false);

  const filtered = tickets.filter(t => {
    if (search && !t.operator.includes(search) && !t.operation.includes(search) && !t.id.includes(search)) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? tickets.find(t => t.id === selectedId) : null;
  const stats = {
    pending: tickets.filter(t => t.status === 'pending').length,
    approved: tickets.filter(t => t.status === 'approved').length,
    today: tickets.filter(t => t.submitTime.startsWith('2026-06-03')).length,
    avgTime: '2.5 分钟',
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="待审批" value={stats.pending} color="#EAB308" icon={<Clock className="w-4 h-4" />} />
        <StatBox label="今日申请" value={stats.today} color="#0066FF" icon={<Plus className="w-4 h-4" />} />
        <StatBox label="今日批准" value={stats.approved} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="平均审批耗时" value={stats.avgTime} color="#9333EA" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">敏感操作自动申请与审批</h2>
            <p className="text-xs text-slate-500 mt-1">L3/L4 高风险操作需要申请审批，审批通过后自动执行</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
            >
              <Plus className="w-3.5 h-3.5" />发起申请
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索申请/操作人"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="pending">待审批</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">发起新申请</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">操作类型</label>
              <select className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5">
                <option>请选择操作...</option>
                <option>冻结域账号</option>
                <option>数据库回滚</option>
                <option>重启关键服务</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">目标资产</label>
              <input type="text" placeholder="输入目标资产" className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">申请原因</label>
              <textarea placeholder="详细说明操作原因" rows={2} className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowNewForm(false)} className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">取消</button>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">提交申请</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">审批工单列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map(t => {
              const sc = statusConfig[t.status];
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === t.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{t.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColor[t.riskLevel]}`}>
                      {t.riskLevel === 'critical' ? '极高风险' : t.riskLevel === 'high' ? '高风险' : '中风险'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{t.operation}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.operator}</span>
                    <span>·</span>
                    <span>目标：{t.targetAsset}</span>
                    <span>·</span>
                    <span>提交：{t.submitTime.split(' ')[1]}</span>
                    {t.approver && <span>·</span>}
                    {t.approver && <span>审批：{t.approver}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selected.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColor[selected.riskLevel]}`}>
                  {selected.riskLevel === 'critical' ? '极高风险' : '高风险'}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {statusConfig[selected.status].icon}{statusConfig[selected.status].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.operation}</h3>
              <p className="text-xs text-slate-400">操作 ID：{selected.operationId}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-xs text-slate-500 mb-1">申请原因</div>
              <p className="text-xs text-yellow-300">{selected.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">申请人</div>
                <div className="text-slate-200">{selected.operator}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">角色</div>
                <div className="text-slate-200">{selected.operatorRole}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标</div>
                <div className="text-slate-200">{selected.targetAsset}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">范围</div>
                <div className="text-slate-200">{selected.targetScope}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">影响资产</div>
                <div className="text-orange-300 font-mono">{selected.affectedAssets} 个</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">预计耗时</div>
                <div className="text-slate-200 font-mono">{selected.estimatedDuration}</div>
              </div>
            </div>

            <div className="bg-[#111625] rounded p-2">
              <div className="text-xs text-slate-500 mb-1">回滚方案</div>
              <p className="text-xs text-slate-300">{selected.rollbackPlan}</p>
            </div>

            {selected.approverComment && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                <div className="text-xs text-yellow-400 mb-1">审批意见 - {selected.approver}</div>
                <p className="text-xs text-yellow-200">{selected.approverComment}</p>
              </div>
            )}

            {selected.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                  <ThumbsUp className="w-3 h-3" />批准
                </button>
                <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md flex items-center justify-center gap-1">
                  <ThumbsDown className="w-3 h-3" />拒绝
                </button>
              </div>
            )}
            {selected.status === 'approved' && (
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">
                执行操作
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">审批趋势（7 天）</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={approvalTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Bar dataKey="submitted" name="申请" fill="#FF6D00" />
            <Bar dataKey="approved" name="批准" fill="#22C55E" />
            <Bar dataKey="rejected" name="拒绝" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
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

export default SensitiveOperationApproval;
