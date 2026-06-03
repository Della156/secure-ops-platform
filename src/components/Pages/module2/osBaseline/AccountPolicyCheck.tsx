'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Play, RefreshCw, Shield, Lock, User,
  Key, AlertTriangle, CheckCircle2, XCircle, Eye, ChevronRight,
  Server, FileText, Activity, Clock, Users
} from 'lucide-react';

interface AccountCheck {
  id: string;
  rule: string;
  description: string;
  category: 'password' | 'account' | 'sudo' | 'lockout' | 'session';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warn' | 'na';
  affectedHosts: number;
  totalHosts: number;
  hosts: { hostname: string; ip: string; actualValue: string; expectedValue: string; status: 'pass' | 'fail' | 'warn' }[];
  reference: string;
  fixSuggestion: string;
}

const checks: AccountCheck[] = [
  {
    id: 'AC-1.1.1', rule: '密码复杂度要求',
    description: '设置密码最小长度、复杂度（大写/小写/数字/特殊字符）等要求',
    category: 'password', severity: 'critical', status: 'fail', affectedHosts: 6, totalHosts: 12,
    hosts: [
      { hostname: 'web-prod-01', ip: '10.10.1.21', actualValue: 'minlen=8', expectedValue: 'minlen=12', status: 'fail' },
      { hostname: 'web-prod-02', ip: '10.10.1.22', actualValue: 'minlen=8', expectedValue: 'minlen=12', status: 'fail' },
      { hostname: 'app-server-01', ip: '10.10.2.10', actualValue: 'minlen=8 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1', expectedValue: 'minlen=14 含4种字符', status: 'fail' },
      { hostname: 'app-server-02', ip: '10.10.2.11', actualValue: 'minlen=8', expectedValue: 'minlen=12', status: 'fail' },
      { hostname: 'db-master-01', ip: '10.10.3.5', actualValue: 'minlen=14 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1', expectedValue: 'minlen=14 含4种字符', status: 'pass' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: 'MinimumPasswordLength=8', expectedValue: 'MinimumPasswordLength=14', status: 'fail' },
    ],
    reference: 'CIS 5.4.1 / NIST 800-63B',
    fixSuggestion: '修改 /etc/security/pwquality.conf，设置 minlen=14、dcredit=-1、ucredit=-1、lcredit=-1、ocredit=-1',
  },
  {
    id: 'AC-1.1.2', rule: '密码最长使用期限',
    description: '密码最长使用天数（MaximumPasswordAge）',
    category: 'password', severity: 'high', status: 'warn', affectedHosts: 3, totalHosts: 12,
    hosts: [
      { hostname: 'web-prod-01', ip: '10.10.1.21', actualValue: 'PASS_MAX_DAYS=99999', expectedValue: 'PASS_MAX_DAYS=90', status: 'fail' },
      { hostname: 'web-prod-02', ip: '10.10.1.22', actualValue: 'PASS_MAX_DAYS=180', expectedValue: 'PASS_MAX_DAYS=90', status: 'fail' },
      { hostname: 'app-server-01', ip: '10.10.2.10', actualValue: 'PASS_MAX_DAYS=90', expectedValue: 'PASS_MAX_DAYS=90', status: 'pass' },
      { hostname: 'db-master-01', ip: '10.10.3.5', actualValue: 'PASS_MAX_DAYS=60', expectedValue: 'PASS_MAX_DAYS=90', status: 'pass' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: 'MaximumPasswordAge=42', expectedValue: 'MaximumPasswordAge=90', status: 'warn' },
    ],
    reference: 'CIS 5.4.1.1',
    fixSuggestion: '修改 /etc/login.defs 设置 PASS_MAX_DAYS 90，使用 chage -M 90 <user> 对已有账户生效',
  },
  {
    id: 'AC-1.1.3', rule: '密码最短使用期限',
    description: '密码最短使用天数（MinimumPasswordAge）',
    category: 'password', severity: 'medium', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部主机', ip: '-', actualValue: 'PASS_MIN_DAYS=7', expectedValue: 'PASS_MIN_DAYS=1', status: 'pass' },
    ],
    reference: 'CIS 5.4.1.2',
    fixSuggestion: '无需修改',
  },
  {
    id: 'AC-1.1.4', rule: '密码历史记录',
    description: '不能重用最近 N 次密码',
    category: 'password', severity: 'medium', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部主机', ip: '-', actualValue: 'remember=5', expectedValue: 'remember=5', status: 'pass' },
    ],
    reference: 'CIS 5.4.1.3',
    fixSuggestion: '无需修改',
  },
  {
    id: 'AC-1.2.1', rule: '空密码账户检查',
    description: '检查是否存在密码为空的账户',
    category: 'account', severity: 'critical', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部主机', ip: '-', actualValue: '0 个空密码账户', expectedValue: '0 个空密码账户', status: 'pass' },
    ],
    reference: 'CIS 6.2.1',
    fixSuggestion: '无需修改',
  },
  {
    id: 'AC-1.2.2', rule: '禁用/锁定账户检查',
    description: '检查未启用的账户是否被锁定',
    category: 'account', severity: 'high', status: 'fail', affectedHosts: 2, totalHosts: 12,
    hosts: [
      { hostname: 'app-server-01', ip: '10.10.2.10', actualValue: 'games, news 账户未锁定', expectedValue: '应锁定', status: 'fail' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: 'Guest 账户未禁用', expectedValue: '应禁用', status: 'fail' },
    ],
    reference: 'CIS 6.2.2',
    fixSuggestion: '使用 passwd -l <user> 锁定账户，Windows 使用 Disable-Guest -Name Guest',
  },
  {
    id: 'AC-1.2.3', rule: '影子文件权限',
    description: '/etc/shadow 文件权限检查',
    category: 'account', severity: 'high', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部 Linux', ip: '-', actualValue: '-rw-r-----  root shadow', expectedValue: '0640 root:shadow', status: 'pass' },
    ],
    reference: 'CIS 6.1.3',
    fixSuggestion: '无需修改',
  },
  {
    id: 'AC-1.3.1', rule: 'sudo 权限检查',
    description: '检查 /etc/sudoers 配置',
    category: 'sudo', severity: 'critical', status: 'fail', affectedHosts: 3, totalHosts: 12,
    hosts: [
      { hostname: 'app-server-01', ip: '10.10.2.10', actualValue: 'NOPASSWD: ALL', expectedValue: '需密码 + 日志', status: 'fail' },
      { hostname: 'devops-runner-01', ip: '10.10.7.5', actualValue: 'NOPASSWD: ALL', expectedValue: '需密码 + 日志', status: 'fail' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: '多个账户在 Administrators 组', expectedValue: '严格授权', status: 'fail' },
    ],
    reference: 'CIS 5.2.1-5.2.8',
    fixSuggestion: '使用 visudo 配置 sudoers，强制密码 + log_input/log_output',
  },
  {
    id: 'AC-1.4.1', rule: '密码失败锁定',
    description: '登录失败 N 次后锁定账户',
    category: 'lockout', severity: 'high', status: 'fail', affectedHosts: 4, totalHosts: 12,
    hosts: [
      { hostname: 'web-prod-01', ip: '10.10.1.21', actualValue: 'pam_tally2 未配置', expectedValue: 'deny=5 unlock_time=900', status: 'fail' },
      { hostname: 'web-prod-02', ip: '10.10.1.22', actualValue: 'pam_tally2 未配置', expectedValue: 'deny=5 unlock_time=900', status: 'fail' },
      { hostname: 'app-server-01', ip: '10.10.2.10', actualValue: 'deny=3 unlock_time=60', expectedValue: 'deny=5 unlock_time=900', status: 'fail' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: 'AccountLockoutThreshold=10', expectedValue: 'AccountLockoutThreshold=5', status: 'fail' },
    ],
    reference: 'CIS 5.3.2',
    fixSuggestion: 'pam 配置：auth required pam_faillock.so preauth deny=5 unlock_time=900',
  },
  {
    id: 'AC-1.4.2', rule: '登录失败锁定日志',
    description: '记录登录失败事件',
    category: 'lockout', severity: 'medium', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部主机', ip: '-', actualValue: '已配置 syslog', expectedValue: '记录到 /var/log/faillog', status: 'pass' },
    ],
    reference: 'CIS 5.3.3',
    fixSuggestion: '无需修改',
  },
  {
    id: 'AC-1.5.1', rule: '会话超时',
    description: '登录后空闲超时自动注销',
    category: 'session', severity: 'medium', status: 'warn', affectedHosts: 5, totalHosts: 12,
    hosts: [
      { hostname: 'web-prod-01', ip: '10.10.1.21', actualValue: 'TMOUT=0', expectedValue: 'TMOUT=900', status: 'fail' },
      { hostname: 'db-master-01', ip: '10.10.3.5', actualValue: 'TMOUT=1800', expectedValue: 'TMOUT=900', status: 'warn' },
      { hostname: 'win-ad-01', ip: '10.10.4.10', actualValue: '无空闲超时', expectedValue: '15 分钟', status: 'fail' },
    ],
    reference: 'CIS 5.5.1',
    fixSuggestion: '/etc/profile 添加 TMOUT=900；Windows 组策略配置空闲超时',
  },
  {
    id: 'AC-1.5.2', rule: '登录横幅',
    description: '配置登录前的法律警告横幅',
    category: 'session', severity: 'low', status: 'pass', affectedHosts: 0, totalHosts: 12,
    hosts: [
      { hostname: '全部主机', ip: '-', actualValue: '已配置 /etc/issue', expectedValue: '包含法律警告', status: 'pass' },
    ],
    reference: 'CIS 1.7.1',
    fixSuggestion: '无需修改',
  },
];

const categoryConfig: Record<AccountCheck['category'], { label: string; icon: React.ReactNode; color: string }> = {
  password: { label: '密码策略', icon: <Key className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  account: { label: '账户安全', icon: <User className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  sudo: { label: 'sudo 权限', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-red-400' },
  lockout: { label: '登录锁定', icon: <Lock className="w-3.5 h-3.5" />, color: 'text-orange-400' },
  session: { label: '会话管理', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
};

const severityColor: Record<AccountCheck['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
};

const statusIcon = (s: string) => {
  if (s === 'pass') return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
  if (s === 'fail') return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  if (s === 'warn') return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />;
  return <span className="w-3.5 h-3.5 inline-block" />;
};

export function AccountPolicyCheck() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('AC-1.1.1');

  const filtered = useMemo(() => {
    return checks.filter(c => {
      if (search && !c.rule.includes(search) && !c.description.includes(search)) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [search, categoryFilter, severityFilter, statusFilter]);

  const selected = selectedId ? checks.find(c => c.id === selectedId) : null;
  const stats = {
    total: checks.length,
    pass: checks.filter(c => c.status === 'pass').length,
    fail: checks.filter(c => c.status === 'fail').length,
    warn: checks.filter(c => c.status === 'warn').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="检查项总数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="通过" value={stats.pass} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.fail} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="告警" value={stats.warn} color="#EAB308" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">账户与口令策略检查</h2>
            <p className="text-xs text-slate-500 mt-1">检查全网主机的密码策略、账户安全、sudo、登录锁定、会话管理</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
              <Play className="w-3.5 h-3.5" />立即扫描
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出报告
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索检查项"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部分类</option>
            <option value="password">密码策略</option>
            <option value="account">账户安全</option>
            <option value="sudo">sudo 权限</option>
            <option value="lockout">登录锁定</option>
            <option value="session">会话管理</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部等级</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部状态</option>
            <option value="pass">通过</option>
            <option value="fail">失败</option>
            <option value="warn">告警</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左侧：检查项列表 */}
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">检查项列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            {filtered.map(c => {
              const cc = categoryConfig[c.category];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer ${selectedId === c.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-slate-500 font-mono text-[10px]">{c.id}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 border rounded text-[10px] ${severityColor[c.severity]}`}>
                      {c.severity === 'critical' ? '严重' : c.severity === 'high' ? '高' : c.severity === 'medium' ? '中' : '低'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs ${cc.color}`}>
                      {cc.icon}{cc.label}
                    </span>
                    <div className="flex-1" />
                    {statusIcon(c.status)}
                    <span className="text-xs text-slate-400">{c.affectedHosts}/{c.totalHosts} 主机</span>
                  </div>
                  <div className="text-sm text-white font-medium mb-0.5">{c.rule}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{c.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：详情 */}
        {selected && (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-500 font-mono text-xs">{selected.id}</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] ${severityColor[selected.severity]}`}>
                  {selected.severity === 'critical' ? '严重' : selected.severity === 'high' ? '高' : selected.severity === 'medium' ? '中' : '低'}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.rule}</h3>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-xs text-slate-500">影响主机</div>
                <div className="text-lg font-semibold text-red-400">{selected.affectedHosts}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-xs text-slate-500">总主机</div>
                <div className="text-lg font-semibold text-slate-300">{selected.totalHosts}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 text-center">
                <div className="text-xs text-slate-500">合规率</div>
                <div className="text-lg font-semibold text-green-400">
                  {Math.round(((selected.totalHosts - selected.affectedHosts) / selected.totalHosts) * 100)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">合规参考</div>
              <div className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1.5">{selected.reference}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">修复建议</div>
              <div className="text-xs text-slate-200 bg-[#111625] border border-[#2A354D] rounded px-2 py-1.5 font-mono break-all">
                {selected.fixSuggestion}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">受影响主机</div>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {selected.hosts.map((h, i) => (
                  <div key={i} className="bg-[#111625] rounded p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-200 flex items-center gap-1.5">
                        {statusIcon(h.status)}
                        {h.hostname}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{h.ip}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">期望: <span className="text-green-400">{h.expectedValue}</span></div>
                    <div className="text-[10px] text-slate-500">实际: <span className="text-red-400">{h.actualValue}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />一键加固所有主机
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
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

export default AccountPolicyCheck;
