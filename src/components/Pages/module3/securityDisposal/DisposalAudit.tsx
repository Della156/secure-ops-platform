'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, RefreshCw, User, FileText,
  Clock, Eye, Lock, Shield, Filter, MoreVertical,
  ChevronRight, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  action: string;
  target: string;
  detail: string;
  result: 'success' | 'failed' | 'warning';
  source: string;
  ip: string;
}

const auditLogs: AuditLog[] = [
  {
    id: 'AUD-20260603001',
    timestamp: '2026-06-03 09:45:12',
    operator: '系统自动',
    role: '自动化引擎',
    action: '自动处置启动',
    target: '服务器-045',
    detail: '检测到 CVE-2024-3094 漏洞利用，启动自动处置流程',
    result: 'success',
    source: '安全引擎',
    ip: '127.0.0.1',
  },
  {
    id: 'AUD-20260603002',
    timestamp: '2026-06-03 09:45:18',
    operator: '系统自动',
    role: '自动化引擎',
    action: '主机隔离',
    target: '服务器-045',
    detail: '通过 EDR 隔离受感染主机，阻断内外网通信',
    result: 'success',
    source: 'EDR Agent',
    ip: '192.168.1.45',
  },
  {
    id: 'AUD-20260603003',
    timestamp: '2026-06-03 09:45:20',
    operator: '系统自动',
    role: '自动化引擎',
    action: '证据收集',
    target: '服务器-045',
    detail: '收集进程列表、网络连接、内存镜像和可疑文件',
    result: 'success',
    source: '取证模块',
    ip: '127.0.0.1',
  },
  {
    id: 'AUD-20260603004',
    timestamp: '2026-06-03 09:18:42',
    operator: '安全工程师 - 李明',
    role: '安全工程师',
    action: '提交审批申请',
    target: '域账号 - 张三',
    detail: '申请冻结可疑账号，理由：检测到境外异常登录',
    result: 'success',
    source: '安全运营平台',
    ip: '192.168.1.100',
  },
  {
    id: 'AUD-20260603005',
    timestamp: '2026-06-03 07:30:12',
    operator: '系统自动',
    role: '自动化引擎',
    action: '挖矿木马检测',
    target: '终端-0128',
    detail: '检测到 Kinsing 挖矿木马活动，置信度 98%',
    result: 'success',
    source: 'EDR Agent',
    ip: '192.168.1.128',
  },
  {
    id: 'AUD-20260603006',
    timestamp: '2026-06-03 07:30:15',
    operator: '系统自动',
    role: '自动化引擎',
    action: '恶意进程终止',
    target: '终端-0128',
    detail: '终止恶意进程 PID: 12847 - bitcoin-miner',
    result: 'success',
    source: 'EDR Agent',
    ip: '192.168.1.128',
  },
  {
    id: 'AUD-20260602001',
    timestamp: '2026-06-02 14:15:20',
    operator: '网络工程师 - 赵伟',
    role: '网络工程师',
    action: 'ACL 规则修改',
    target: '边界防火墙',
    detail: '添加 DDoS 攻击源 IP 封禁规则',
    result: 'success',
    source: '网络管理系统',
    ip: '192.168.1.110',
  },
  {
    id: 'AUD-20260601001',
    timestamp: '2026-06-01 15:30:00',
    operator: '安全工程师 - 李明',
    role: '安全工程师',
    action: 'ACL 规则修改',
    target: '边界防火墙',
    detail: '尝试添加 DDoS 攻击源 IP 封禁规则',
    result: 'failed',
    source: '网络管理系统',
    ip: '192.168.1.100',
  },
  {
    id: 'AUD-20260531001',
    timestamp: '2026-05-31 16:20:00',
    operator: '安全工程师 - 李明',
    role: '安全工程师',
    action: 'WebShell 查杀',
    target: 'Web 服务器 01',
    detail: '检测并清除 3 个 WebShell 文件',
    result: 'success',
    source: '安全运营平台',
    ip: '192.168.1.100',
  },
  {
    id: 'AUD-20260530001',
    timestamp: '2026-05-30 09:15:00',
    operator: '安全工程师 - 李工',
    role: '安全工程师',
    action: '账号冻结',
    target: '域账号 - 张三',
    detail: '违规账号冻结操作',
    result: 'success',
    source: 'AD 管理系统',
    ip: '192.168.1.102',
  },
];

const resultConfig = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3.5 h-3.5" /> },
  warning: { label: '警告', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export function DisposalAudit() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (search && !log.action.includes(search) && !log.target.includes(search) && !log.detail.includes(search) && !log.operator.includes(search)) {
        return false;
      }
      if (resultFilter !== 'all' && log.result !== resultFilter) return false;
      if (operatorFilter !== 'all' && log.operator !== operatorFilter) return false;
      return true;
    });
  }, [search, resultFilter, operatorFilter]);

  const stats = {
    total: auditLogs.length,
    success: auditLogs.filter(log => log.result === 'success').length,
    failed: auditLogs.filter(log => log.result === 'failed').length,
    warning: auditLogs.filter(log => log.result === 'warning').length,
  };

  const operators = [...new Set(auditLogs.map(log => log.operator))];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="审计记录" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
        <StatBox label="警告" value={stats.warning} color="#EAB308" icon={<AlertCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">安全综合处置任务审计</h2>
            <p className="text-xs text-slate-500 mt-1">完整记录所有安全操作的审计日志</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出日志
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text" placeholder="搜索操作/目标/内容..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={resultFilter} onChange={e => setResultFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
            <option value="warning">警告</option>
          </select>
          <select value={operatorFilter} onChange={e => setOperatorFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部操作人</option>
            {operators.map(op => <option key={op} value={op}>{op}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex items-center gap-1 flex-1">
              <input
                type="date" placeholder="开始"
                value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5 focus:border-blue-500 outline-none"
              />
              <span className="text-slate-500 text-xs">-</span>
              <input
                type="date" placeholder="结束"
                value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="flex-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md px-2 py-1.5 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">审计日志 ({filteredLogs.length})</h3>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {filteredLogs.map(log => {
              const rc = resultConfig[log.result as keyof typeof resultConfig];
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{log.id}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>
                      {rc.icon}{rc.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-white font-medium">{log.action}</div>
                    <span className="text-xs text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">目标: <span className="text-slate-300">{log.target}</span></div>
                  <div className="text-xs text-slate-400 line-clamp-1">{log.detail}</div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.operator}</span>
                    <span>·</span>
                    <span>{log.role}</span>
                    <span>·</span>
                    <span>来源: {log.source}</span>
                    <span>·</span>
                    <span className="font-mono">{log.ip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedLog ? (
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">{selectedLog.id}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selectedLog.result as keyof typeof resultConfig].bg} ${resultConfig[selectedLog.result as keyof typeof resultConfig].color}`}>
                  {resultConfig[selectedLog.result as keyof typeof resultConfig].icon}{resultConfig[selectedLog.result as keyof typeof resultConfig].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selectedLog.action}</h3>
              <p className="text-xs text-slate-400">时间: {selectedLog.timestamp}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-3">
              <div className="text-xs text-slate-500 mb-1">操作详情</div>
              <p className="text-sm text-slate-200">{selectedLog.detail}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">操作人</div>
                <div className="text-slate-200">{selectedLog.operator}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">角色</div>
                <div className="text-slate-200">{selectedLog.role}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标</div>
                <div className="text-slate-200">{selectedLog.target}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">来源</div>
                <div className="text-slate-200">{selectedLog.source}</div>
              </div>
              <div className="bg-[#111625] rounded p-2 md:col-span-2">
                <div className="text-slate-500 mb-0.5">来源 IP</div>
                <div className="text-slate-200 font-mono">{selectedLog.ip}</div>
              </div>
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

export default DisposalAudit;
