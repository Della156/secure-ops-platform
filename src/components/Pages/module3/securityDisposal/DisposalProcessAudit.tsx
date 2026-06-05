'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Eye, Download, RefreshCw, User,
  Clock, FileText, Server, Database, CheckCircle2,
  XCircle, AlertCircle, Lock, Shield, PlayCircle,
  Activity, ArrowRight
} from 'lucide-react';

interface DisposalRecord {
  id: string;
  caseId: string;
  operationId: string;
  operationName: string;
  operator: string;
  operatorRole: string;
  targetAsset: string;
  actionType: 'isolate' | 'kill' | 'quarantine' | 'block' | 'rollback' | 'recover' | 'patch';
  actionDetail: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  result: 'success' | 'partial' | 'failed';
  logs: string[];
  affectedAssets: number;
  rollbackAvailable: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const records: DisposalRecord[] = [
  {
    id: 'REC-20260603001',
    caseId: 'SD-20260603002',
    operationId: 'OP-004',
    operationName: '挖矿木马完整处置',
    operator: '系统自动',
    operatorRole: '自动化引擎',
    targetAsset: '终端-0128',
    actionType: 'kill',
    actionDetail: '终止挖矿进程、删除木马文件、清除持久化、加固系统、恢复业务',
    startTime: '2026-06-03 07:30:12',
    endTime: '2026-06-03 07:32:40',
    duration: '2 分 28 秒',
    result: 'success',
    logs: [
      '[07:30:12] 检测到挖矿进程，启动自动化处置流程',
      '[07:30:13] 成功终止恶意进程 (PID: 12847)',
      '[07:30:15] 删除木马文件：/tmp/miner/bitcoin-miner',
      '[07:30:20] 删除自启动项：/etc/crontab/miner',
      '[07:30:30] 系统加固：禁用不必要的端口',
      '[07:32:40] 所有操作完成，验证通过',
    ],
    affectedAssets: 1,
    rollbackAvailable: false,
    riskLevel: 'medium',
  },
  {
    id: 'REC-20260603002',
    caseId: 'SD-20260603001',
    operationId: 'OP-001',
    operationName: '隔离受影响主机',
    operator: '系统自动',
    operatorRole: '自动化引擎',
    targetAsset: '服务器-045',
    actionType: 'isolate',
    actionDetail: '通过 EDR 隔离受感染服务器',
    startTime: '2026-06-03 09:45:18',
    endTime: '2026-06-03 09:45:30',
    duration: '12 秒',
    result: 'success',
    logs: [
      '[09:45:18] 收到隔离指令',
      '[09:45:20] 发送隔离命令到 EDR agent',
      '[09:45:25] EDR 确认网络隔离成功',
      '[09:45:30] 主机已从网络中隔离',
    ],
    affectedAssets: 1,
    rollbackAvailable: true,
    riskLevel: 'high',
  },
  {
    id: 'REC-20260603003',
    caseId: 'SD-20260603001',
    operationId: 'OP-003',
    operationName: '收集证据',
    operator: '系统自动',
    operatorRole: '自动化引擎',
    targetAsset: '服务器-045',
    actionType: 'quarantine',
    actionDetail: '收集进程列表、网络连接、内存镜像、可疑文件',
    startTime: '2026-06-03 09:45:32',
    endTime: '2026-06-03 09:46:17',
    duration: '45 秒',
    result: 'success',
    logs: [
      '[09:45:32] 开始证据收集',
      '[09:45:35] 导出进程列表（234 个进程）',
      '[09:45:40] 导出网络连接（45 个连接）',
      '[09:45:45] 内存镜像开始（2GB）',
      '[09:46:10] 内存镜像完成，已上传到证据服务器',
      '[09:46:17] 收集可疑文件 12 个，大小 245MB',
    ],
    affectedAssets: 1,
    rollbackAvailable: false,
    riskLevel: 'low',
  },
  {
    id: 'REC-20260602001',
    caseId: 'SD-20260602001',
    operationId: 'OP-014',
    operationName: '钓鱼邮件批量删除',
    operator: '系统自动',
    operatorRole: '自动化引擎',
    targetAsset: '邮件服务器',
    actionType: 'block',
    actionDetail: '从 142 个邮箱删除钓鱼邮件',
    startTime: '2026-06-02 06:00:00',
    endTime: '2026-06-02 06:08:23',
    duration: '8 分 23 秒',
    result: 'success',
    logs: [
      '[06:00:00] 开始批量删除操作',
      '[06:02:15] 删除 50 个邮箱中的钓鱼邮件',
      '[06:04:30] 删除 50 个邮箱中的钓鱼邮件',
      '[06:06:45] 删除 42 个邮箱中的钓鱼邮件',
      '[06:08:23] 完成，共删除 234 封邮件',
    ],
    affectedAssets: 142,
    rollbackAvailable: false,
    riskLevel: 'medium',
  },
  {
    id: 'REC-20260601001',
    caseId: 'SD-20260601001',
    operationId: 'OP-015',
    operationName: '修改 ACL 规则失败',
    operator: '安全工程师 - 李明',
    operatorRole: '安全工程师',
    targetAsset: '边界防火墙',
    actionType: 'block',
    actionDetail: '添加 DDoS 攻击源封禁规则',
    startTime: '2026-06-01 15:30:00',
    endTime: '2026-06-01 15:30:15',
    duration: '15 秒',
    result: 'failed',
    logs: [
      '[15:30:00] 发送命令到防火墙',
      '[15:30:05] 防火墙返回：权限不足',
      '[15:30:10] 重试...同样失败',
      '[15:30:15] 操作失败，请联系网络工程师',
    ],
    affectedAssets: 0,
    rollbackAvailable: false,
    riskLevel: 'medium',
  },
];

const actionTypeConfig: Record<DisposalRecord['actionType'], { label: string; color: string; icon: any }> = {
  isolate: { label: '隔离', color: 'text-orange-400', icon: <Lock className="w-3 h-3" /> },
  kill: { label: '终止', color: 'text-red-400', icon: <XCircle className="w-3 h-3" /> },
  quarantine: { label: '取证', color: 'text-purple-400', icon: <FileText className="w-3 h-3" /> },
  block: { label: '阻断', color: 'text-blue-400', icon: <Shield className="w-3 h-3" /> },
  rollback: { label: '回滚', color: 'text-yellow-400', icon: <PlayCircle className="w-3 h-3" /> },
  recover: { label: '恢复', color: 'text-green-400', icon: <CheckCircle2 className="w-3 h-3" /> },
  patch: { label: '补丁', color: 'text-cyan-400', icon: <Activity className="w-3 h-3" /> },
};

const resultConfig: Record<DisposalRecord['result'], { label: string; color: string; bg: string; icon: any }> = {
  success: { label: '成功', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  partial: { label: '部分成功', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <AlertCircle className="w-3 h-3" /> },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle className="w-3 h-3" /> },
};

const riskColor: Record<DisposalRecord['riskLevel'], string> = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

export function DisposalProcessAudit() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>('REC-20260603001');

  const filtered = records.filter(r => {
    if (search && !r.operator.includes(search) && !r.operationName.includes(search) && !r.targetAsset.includes(search) && !r.id.includes(search)) return false;
    if (filter !== 'all' && r.result !== filter) return false;
    return true;
  });

  const selected = selectedId ? records.find(r => r.id === selectedId) : null;
  const stats = {
    total: records.length,
    success: records.filter(r => r.result === 'success').length,
    today: records.filter(r => r.startTime.startsWith('2026-06-03')).length,
    failed: records.filter(r => r.result === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="总记录数" value={stats.total} color="#0066FF" icon={<FileText className="w-4 h-4" />} />
        <StatBox label="成功" value={stats.success} color="#22C55E" icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatBox label="今日处置" value={stats.today} color="#FF6D00" icon={<Activity className="w-4 h-4" />} />
        <StatBox label="失败" value={stats.failed} color="#EF4444" icon={<XCircle className="w-4 h-4" />} />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">处置过程记录与审计</h2>
            <p className="text-xs text-slate-500 mt-1">完整记录所有安全处置操作，支持审计和追溯</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
              <Download className="w-3.5 h-3.5" />导出审计日志
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索记录/操作/目标..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部结果</option>
            <option value="success">成功</option>
            <option value="partial">部分成功</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">处置记录列表 ({filtered.length})</h3>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {filtered.map(r => {
              const rc = resultConfig[r.result as keyof typeof resultConfig];
              const ac = actionTypeConfig[r.actionType as keyof typeof actionTypeConfig];
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedId === r.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-400 font-mono">{r.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColor[r.riskLevel]}`}>
                      {r.riskLevel === 'critical' ? '极高' : r.riskLevel === 'high' ? '高' : r.riskLevel === 'medium' ? '中' : '低'}风险
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${rc.bg} ${rc.color}`}>
                      {rc.icon}{rc.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 ${ac.color}`}>
                      {ac.icon}{ac.label}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mb-1">{r.operationName}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{r.operator}</span>
                    <span>·</span>
                    <span>目标：{r.targetAsset}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.startTime.split(' ')[1]}</span>
                    {r.duration && <span>·</span>}
                    {r.duration && <span>耗时：{r.duration}</span>}
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
                  {selected.riskLevel === 'critical' ? '极高风险' : selected.riskLevel === 'high' ? '高风险' : selected.riskLevel === 'medium' ? '中风险' : '低风险'}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${resultConfig[selected.result as keyof typeof resultConfig].bg} ${resultConfig[selected.result as keyof typeof resultConfig].color}`}>
                  {resultConfig[selected.result as keyof typeof resultConfig].icon}{resultConfig[selected.result as keyof typeof resultConfig].label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{selected.operationName}</h3>
              <p className="text-xs text-slate-400">关联案例：{selected.caseId} · 操作 ID：{selected.operationId}</p>
            </div>

            <div className="bg-[#111625] border border-[#2A354D] rounded p-2">
              <div className="text-xs text-slate-500 mb-1">操作描述</div>
              <p className="text-xs text-slate-300">{selected.actionDetail}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">操作人</div>
                <div className="text-slate-200">{selected.operator}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">角色</div>
                <div className="text-slate-200">{selected.operatorRole}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">目标资产</div>
                <div className="text-slate-200">{selected.targetAsset}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">影响资产</div>
                <div className="text-orange-300 font-mono">{selected.affectedAssets} 个</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">开始时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.startTime}</div>
              </div>
              <div className="bg-[#111625] rounded p-2">
                <div className="text-slate-500 mb-0.5">结束时间</div>
                <div className="text-slate-200 font-mono text-[10px]">{selected.endTime || '进行中'}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1.5">操作日志</div>
              <div className="bg-[#111625] border border-[#2A354D] rounded p-2 max-h-[200px] overflow-y-auto">
                {selected.logs.map((log, i) => (
                  <div key={i} className="text-[10px] text-slate-300 py-0.5 border-b border-slate-700/30 last:border-0">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {selected.rollbackAvailable && (
              <button className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md">
                执行回滚
              </button>
            )}
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

export default DisposalProcessAudit;
