'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Download, RefreshCw, Filter, Eye, Shield,
  AlertCircle, CheckCircle2, Clock, Activity, Zap, ChevronRight,
  Server, Cpu, Network, FileText, Key, User, Lock,
  TrendingUp, ChevronDown, ArrowRight, XCircle, MoreVertical
} from 'lucide-react';

interface DisposalCase {
  id: string;
  title: string;
  alertId: string;
  alertType: '恶意软件' | '钓鱼邮件' | '数据泄露' | '越权访问' | '漏洞利用' | '暴力破解' | '内网异常';
  severity: 'critical' | 'high' | 'medium';
  level: 'L1-自动' | 'L2-半自动' | 'L3-审批' | 'L4-人工';
  status: 'pending' | 'auto-running' | 'awaiting-approval' | 'executing' | 'completed' | 'failed';
  assets: number;
  actions: { name: string; status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'; duration?: string }[];
  startTime: string;
  completedTime: string | null;
  operator: string;
  approver: string | null;
}

const cases: DisposalCase[] = [
  { id: 'SD-2026060301', title: 'CVE-2024-3094 XZ Utils 后门处置', alertId: 'AL-99821', alertType: '漏洞利用', severity: 'critical', level: 'L1-自动', status: 'auto-running', assets: 23, actions: [
    { name: '隔离受影响主机', status: 'success', duration: '12s' },
    { name: '收集证据', status: 'success', duration: '45s' },
    { name: '推送补丁', status: 'running', duration: '1m 24s' },
    { name: '重启服务', status: 'pending' },
    { name: '验证修复', status: 'pending' },
    { name: '通知业务方', status: 'pending' },
  ], startTime: '09:42:18', completedTime: null, operator: '系统自动', approver: null },
  { id: 'SD-2026060302', title: '挖矿木马处置 (Kinsing)', alertId: 'AL-99808', alertType: '恶意软件', severity: 'high', level: 'L1-自动', status: 'completed', assets: 1, actions: [
    { name: '隔离挖矿主机', status: 'success', duration: '8s' },
    { name: '杀进程', status: 'success', duration: '3s' },
    { name: '清除持久化', status: 'success', duration: '18s' },
    { name: '杀挖矿文件', status: 'success', duration: '12s' },
    { name: '系统加固', status: 'success', duration: '32s' },
    { name: '恢复业务', status: 'success', duration: '15s' },
  ], startTime: '07:30:12', completedTime: '07:32:40', operator: '系统自动', approver: null },
  { id: 'SD-2026060303', title: '横向移动账号冻结', alertId: 'AL-99815', alertType: '内网异常', severity: 'high', level: 'L2-半自动', status: 'awaiting-approval', assets: 5, actions: [
    { name: '检测异常', status: 'success', duration: '5s' },
    { name: '建议处置动作', status: 'success', duration: '2s' },
    { name: '审批', status: 'running' },
    { name: '冻结账号 zhang.wei', status: 'pending' },
    { name: '强制注销会话', status: 'pending' },
  ], startTime: '09:18:42', completedTime: null, operator: 'AI 推荐', approver: '李工' },
  { id: 'SD-2026060304', title: '数据库 SQL 注入处置', alertId: 'AL-99812', alertType: '漏洞利用', severity: 'critical', level: 'L3-审批', status: 'awaiting-approval', assets: 1, actions: [
    { name: 'WAF 拦截规则', status: 'success', duration: '3s' },
    { name: 'SQL 审计开启', status: 'success', duration: '5s' },
    { name: '回滚注入数据', status: 'pending' },
    { name: '修改 sa 密码', status: 'pending' },
    { name: '补丁更新', status: 'pending' },
  ], startTime: '08:20:15', completedTime: null, operator: 'DBA', approver: '王经理' },
  { id: 'SD-2026060305', title: '钓鱼邮件批量处置', alertId: 'AL-99805', alertType: '钓鱼邮件', severity: 'medium', level: 'L1-自动', status: 'completed', assets: 142, actions: [
    { name: '从所有邮箱删除', status: 'success', duration: '2m 18s' },
    { name: '重置点击用户密码', status: 'success', duration: '1m 45s' },
    { name: '扫描终端落地的附件', status: 'success', duration: '3m 12s' },
    { name: '推送告警', status: 'success', duration: '8s' },
  ], startTime: '06:00:00', completedTime: '06:08:23', operator: '系统自动', approver: null },
  { id: 'SD-2026060306', title: 'DDoS 攻击流量清洗', alertId: 'AL-99802', alertType: '暴力破解', severity: 'high', level: 'L1-自动', status: 'auto-running', assets: 8, actions: [
    { name: '流量牵引', status: 'success', duration: '4s' },
    { name: '清洗中心引流', status: 'running' },
    { name: '黑名单更新', status: 'pending' },
    { name: '回注流量', status: 'pending' },
  ], startTime: '09:38:00', completedTime: null, operator: '系统自动', approver: null },
];

const levelColor = {
  'L1-自动': 'bg-green-500/20 text-green-400 border-green-500/40',
  'L2-半自动': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'L3-审批': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  'L4-人工': 'bg-red-500/20 text-red-400 border-red-500/40',
};

const statusConfig = {
  pending: { label: '待执行', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  'auto-running': { label: '执行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'awaiting-approval': { label: '待审批', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  executing: { label: '执行中', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const actionIcon = (status: string) => {
  if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
  if (status === 'running') return <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />;
  if (status === 'failed') return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  if (status === 'skipped') return <ChevronRight className="w-3.5 h-3.5 text-slate-500" />;
  return <Clock className="w-3.5 h-3.5 text-slate-500" />;
};

export function SecurityDisposalView() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('SD-2026060301');

  const filtered = cases.filter(c => {
    if (search && !c.title.includes(search) && !c.id.includes(search)) return false;
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const selected = selectedId ? cases.find(c => c.id === selectedId) : null;
  const stats = {
    total: cases.length,
    auto: cases.filter(c => c.level === 'L1-自动').length,
    awaiting: cases.filter(c => c.status === 'awaiting-approval').length,
    running: cases.filter(c => c.status === 'auto-running' || c.status === 'executing').length,
    completed: cases.filter(c => c.status === 'completed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="处置案例" value={stats.total} color="#0066FF" icon={<Shield className="w-4 h-4" />} />
        <StatBox label="全自动" value={stats.auto} color="#22C55E" icon={<Zap className="w-4 h-4" />} />
        <StatBox label="待审批" value={stats.awaiting} color="#EAB308" icon={<Clock className="w-4 h-4" />} />
        <StatBox label="执行中" value={stats.running} color="#0066FF" icon={<Activity className="w-4 h-4" />} pulse />
        <StatBox label="已完成" value={stats.completed} color="#9333EA" icon={<CheckCircle2 className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">安全综合处置视图</h2>
            <p className="text-xs text-slate-500 mt-1">告警 → 自动化分级处置 → 闭环验证 · L1 自动 / L2 半自动 / L3 审批 / L4 人工</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Plus className="w-3.5 h-3.5" />新建案例
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
              type="text" placeholder="搜索案例/告警"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部等级</option>
            <option value="L1-自动">L1-自动</option>
            <option value="L2-半自动">L2-半自动</option>
            <option value="L3-审批">L3-审批</option>
            <option value="L4-人工">L4-人工</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="pending">待执行</option>
            <option value="auto-running">执行中</option>
            <option value="awaiting-approval">待审批</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 案例列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">处置案例 ({filtered.length})</h3>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
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
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[c.level]}`}>
                      {c.level}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded ${
                      c.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      c.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    }`}>
                      {c.severity === 'critical' ? '严重' : c.severity === 'high' ? '高' : '中'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{c.title}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>告警 <span className="font-mono text-blue-300">{c.alertId}</span></span>
                    <span>·</span>
                    <span>资产 <span className="text-slate-300">{c.assets}</span> 个</span>
                    <span>·</span>
                    <span>操作人 <span className="text-slate-300">{c.operator}</span></span>
                    {c.approver && <><span>·</span><span>审批人 <span className="text-yellow-300">{c.approver}</span></span></>}
                  </div>
                  {/* 动作进度条 */}
                  <div className="flex items-center gap-1 mt-2">
                    {c.actions.map((a, i) => (
                      <React.Fragment key={i}>
                        <div className={`flex-1 h-1 rounded ${
                          a.status === 'success' ? 'bg-green-500' :
                          a.status === 'running' ? 'bg-blue-500 animate-pulse' :
                          a.status === 'failed' ? 'bg-red-500' :
                          'bg-slate-700'
                        }`} />
                      </React.Fragment>
                    ))}
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
                <span className={`text-[10px] px-1.5 py-0.5 border rounded ${levelColor[selected.level]}`}>{selected.level}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.title}</h3>
              <div className="text-xs text-slate-500">告警 <span className="text-blue-300 font-mono">{selected.alertId}</span> · {selected.alertType}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">状态</div>
                <div className={statusConfig[selected.status as keyof typeof statusConfig].color}>{statusConfig[selected.status as keyof typeof statusConfig].label}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">影响资产</div>
                <div className="text-slate-200 font-mono">{selected.assets}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">完成时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.completedTime || '进行中'}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">处置动作链 ({selected.actions.filter(a => a.status === 'success').length}/{selected.actions.length})</div>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {selected.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-[#111625] rounded">
                    {actionIcon(a.status)}
                    <span className={`text-xs flex-1 ${a.status === 'success' ? 'text-slate-200' : a.status === 'running' ? 'text-blue-300' : 'text-slate-500'}`}>{a.name}</span>
                    {a.duration && <span className="text-[10px] text-slate-500 font-mono">{a.duration}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {selected.status === 'awaiting-approval' ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md">批准</button>
                  <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md">驳回</button>
                </>
              ) : (
                <>
                  <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">查看详情</button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md">追溯</button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon, pulse }: { label: string; value: any; color: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span style={{ color }} className={pulse ? 'animate-pulse' : ''}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default SecurityDisposalView;
