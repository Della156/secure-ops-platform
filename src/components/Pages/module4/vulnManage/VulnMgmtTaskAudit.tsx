'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, Clock, FileText, User, Activity,
  CheckCircle2, XCircle, Edit, Trash2, Plus, AlertCircle,
  Shield, Eye, Calendar, Settings
} from 'lucide-react';

/**
 * 4.6-11 漏洞管理任务审计
 *
 * 审计日志：
 * - 所有漏洞管理操作的完整记录
 * - 不可篡改的审计追踪
 * - 操作详情 + 变更前后对比
 */

type ActionType = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'execute' | 'pause' | 'resume' | 'export' | 'import' | 'login' | 'config';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  ip: string;
  action: ActionType;
  resource: string;
  resourceId: string;
  result: 'success' | 'failed';
  details: string;
  changes?: { field: string; before: string; after: string }[];
  hash: string; // 区块链式哈希
}

const auditLogs: AuditLog[] = [
  {
    id: 'AL-20260602-0001',
    timestamp: '2026-06-02 16:23:45',
    user: '张伟',
    userRole: '安全负责人',
    ip: '10.1.10.55',
    action: 'approve',
    resource: '风险接受申请',
    resourceId: 'UF-2026-0001',
    result: 'success',
    details: '批准了 WordPress 旧版插件 RCE 风险接受申请',
    changes: [
      { field: '状态', before: '待审批', after: '已通过' },
      { field: '审批人', before: '张伟', after: '张伟' },
    ],
    hash: 'a3f5b8c9d2e1f4a7',
  },
  {
    id: 'AL-20260602-0002',
    timestamp: '2026-06-02 16:15:23',
    user: '李娜',
    userRole: '业务负责人',
    ip: '10.1.10.78',
    action: 'create',
    resource: '扫描任务',
    resourceId: 'ST-2026-0001',
    result: 'success',
    details: '创建了扫描任务：核心业务系统紧急扫描',
    changes: [
      { field: '任务名称', before: '-', after: '核心业务系统紧急扫描' },
      { field: '目标', before: '-', after: '10.1.0.0/24' },
      { field: '类型', before: '-', after: '全面扫描' },
    ],
    hash: 'b7e2c1d4f9a3b6e8',
  },
  {
    id: 'AL-20260602-0003',
    timestamp: '2026-06-02 16:08:12',
    user: '王强',
    userRole: '运维工程师',
    ip: '10.1.10.45',
    action: 'execute',
    resource: '整改任务',
    resourceId: 'RT-2026-0089',
    result: 'failed',
    details: '执行整改任务失败：无法连接目标主机 10.1.20.10',
    hash: 'c9d4e7f2a1b5c8d3',
  },
  {
    id: 'AL-20260602-0004',
    timestamp: '2026-06-02 15:42:30',
    user: '赵敏',
    userRole: '安全分析师',
    ip: '10.1.10.62',
    action: 'update',
    resource: '漏洞',
    resourceId: 'VULN-2024-0042',
    result: 'success',
    details: '更新了漏洞信息',
    changes: [
      { field: 'CVSS 评分', before: '9.5', after: '10.0' },
      { field: '状态', before: '已确认', after: '修复中' },
    ],
    hash: 'd1e5f8a3b6c9d2e7',
  },
  {
    id: 'AL-20260602-0005',
    timestamp: '2026-06-02 15:30:00',
    user: '张伟',
    userRole: '安全负责人',
    ip: '10.1.10.55',
    action: 'config',
    resource: '扫描策略',
    resourceId: 'POL-NESSUS-001',
    result: 'success',
    details: '更新了 Nessus 扫描策略：基线检测 v2.3',
    changes: [
      { field: '启用插件数', before: '5234', after: '5891' },
      { field: '扫描深度', before: 'Level 2', after: 'Level 3' },
    ],
    hash: 'e4f7a1b5c8d3e6f9',
  },
  {
    id: 'AL-20260602-0006',
    timestamp: '2026-06-02 14:58:22',
    user: '系统',
    userRole: '系统',
    ip: '127.0.0.1',
    action: 'execute',
    resource: '定时任务',
    resourceId: 'CRON-SCAN-001',
    result: 'success',
    details: '定时执行：每周一全网基线扫描',
    hash: 'f5a8b2c6d9e3f7a1',
  },
  {
    id: 'AL-20260602-0007',
    timestamp: '2026-06-02 14:45:00',
    user: '李娜',
    userRole: '业务负责人',
    ip: '10.1.10.78',
    action: 'reject',
    resource: '风险接受申请',
    resourceId: 'UF-2026-0004',
    result: 'success',
    details: '驳回了 Apache Struts 远程代码执行风险接受申请：风险过高，必须修复',
    changes: [
      { field: '状态', before: '待审批', after: '已驳回' },
    ],
    hash: 'a2b6c9d3e7f1a4b8',
  },
  {
    id: 'AL-20260602-0008',
    timestamp: '2026-06-02 14:30:15',
    user: '孙八',
    userRole: '运维工程师',
    ip: '10.1.10.90',
    action: 'delete',
    resource: '整改任务',
    resourceId: 'RT-2026-0078',
    result: 'success',
    details: '删除了误创建的整改任务',
    hash: 'b4c8d1e5f9a2b6c3',
  },
  {
    id: 'AL-20260602-0009',
    timestamp: '2026-06-02 14:12:45',
    user: '王强',
    userRole: '运维工程师',
    ip: '10.1.10.45',
    action: 'export',
    resource: '漏洞报告',
    resourceId: 'RPT-20260602-001',
    result: 'success',
    details: '导出漏洞报告：核心业务系统漏洞清单',
    changes: [
      { field: '记录数', before: '-', after: '237' },
      { field: '文件', before: '-', after: 'vuln_report_20260602.pdf' },
    ],
    hash: 'c6d9e2f5a8b1c4d7',
  },
  {
    id: 'AL-20260602-0010',
    timestamp: '2026-06-02 13:55:00',
    user: '周九',
    userRole: '业务负责人',
    ip: '10.1.10.102',
    action: 'login',
    resource: '系统',
    resourceId: '-',
    result: 'success',
    details: '登录系统',
    hash: 'd8e1f4a7b3c6d9e2',
  },
  {
    id: 'AL-20260602-0011',
    timestamp: '2026-06-02 13:42:30',
    user: '周九',
    userRole: '业务负责人',
    ip: '203.0.113.45',
    action: 'login',
    resource: '系统',
    resourceId: '-',
    result: 'failed',
    details: '登录失败：密码错误',
    hash: 'e2f5a8b4c7d1e4f7',
  },
  {
    id: 'AL-20260602-0012',
    timestamp: '2026-06-02 13:30:00',
    user: '钱七',
    userRole: '开发工程师',
    ip: '10.1.10.115',
    action: 'import',
    resource: '漏洞库',
    resourceId: 'CUSTOM-001',
    result: 'success',
    details: '导入了自定义漏洞规则：弱口令检测 v1.2',
    changes: [
      { field: '规则数', before: '232', after: '234' },
    ],
    hash: 'f4a7b1c5d8e2f5a8',
  },
];

const actionConfig: Record<ActionType, { l: string; c: string; icon: React.ReactNode }> = {
  create: { l: '创建', c: 'text-green-400 bg-green-500/10', icon: <Plus className="w-3 h-3" /> },
  update: { l: '更新', c: 'text-blue-400 bg-blue-500/10', icon: <Edit className="w-3 h-3" /> },
  delete: { l: '删除', c: 'text-red-400 bg-red-500/10', icon: <Trash2 className="w-3 h-3" /> },
  approve: { l: '批准', c: 'text-green-400 bg-green-500/10', icon: <CheckCircle2 className="w-3 h-3" /> },
  reject: { l: '驳回', c: 'text-red-400 bg-red-500/10', icon: <XCircle className="w-3 h-3" /> },
  execute: { l: '执行', c: 'text-purple-400 bg-purple-500/10', icon: <Activity className="w-3 h-3" /> },
  pause: { l: '暂停', c: 'text-yellow-400 bg-yellow-500/10', icon: <Clock className="w-3 h-3" /> },
  resume: { l: '恢复', c: 'text-cyan-400 bg-cyan-500/10', icon: <Activity className="w-3 h-3" /> },
  export: { l: '导出', c: 'text-orange-400 bg-orange-500/10', icon: <FileText className="w-3 h-3" /> },
  import: { l: '导入', c: 'text-pink-400 bg-pink-500/10', icon: <FileText className="w-3 h-3" /> },
  login: { l: '登录', c: 'text-gray-400 bg-gray-500/10', icon: <User className="w-3 h-3" /> },
  config: { l: '配置', c: 'text-indigo-400 bg-indigo-500/10', icon: <Settings className="w-3 h-3" /> },
};

export function VulnTaskAudit() {
  const [searchKw, setSearchKw] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return auditLogs.filter(log => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (resultFilter !== 'all' && log.result !== resultFilter) return false;
      if (searchKw && !log.id.includes(searchKw) && !log.user.includes(searchKw) && !log.resource.includes(searchKw) && !log.details.includes(searchKw)) return false;
      return true;
    });
  }, [searchKw, actionFilter, resultFilter]);

  const selected = auditLogs.find(l => l.id === selectedId);
  const total = auditLogs.length;
  const successCount = auditLogs.filter(l => l.result === 'success').length;
  const failedCount = auditLogs.filter(l => l.result === 'failed').length;
  const todayCount = auditLogs.length; // 假设都是今天

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            漏洞管理任务审计
          </h2>
          <span className="text-xs text-gray-500">共 {total} 条 · 今日 {todayCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            完整性校验
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '今日审计日志', value: todayCount, color: 'blue', icon: <Activity className="w-4 h-4" /> },
          { label: '成功操作', value: successCount, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '失败操作', value: failedCount, color: 'red', icon: <XCircle className="w-4 h-4" /> },
          { label: '完整性', value: '100%', color: 'purple', icon: <Shield className="w-4 h-4" />, sub: '哈希校验通过' },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* 筛选 */}
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              placeholder="搜索 ID / 用户 / 资源 / 详情..."
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
            />
          </div>
          <select className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm rounded px-2 py-1.5">
            <option>近 24 小时</option>
            <option>近 7 天</option>
            <option>近 30 天</option>
            <option>自定义</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex border border-[#2A354D] rounded overflow-hidden flex-wrap">
            <button
              onClick={() => setActionFilter('all')}
              className={`px-2.5 py-1 text-xs ${actionFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
            >
              全部操作
            </button>
            {(Object.keys(actionConfig) as ActionType[]).map(a => (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={`px-2.5 py-1 text-xs ${actionFilter === a ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
              >
                {actionConfig[a].l}
              </button>
            ))}
          </div>
          <div className="flex border border-[#2A354D] rounded overflow-hidden">
            {[
              { v: 'all', l: '全部结果' },
              { v: 'success', l: '成功' },
              { v: 'failed', l: '失败' },
            ].map(f => (
              <button
                key={f.v}
                onClick={() => setResultFilter(f.v)}
                className={`px-2.5 py-1 text-xs ${resultFilter === f.v ? 'bg-blue-600 text-white' : 'bg-[#111625] text-gray-400'}`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 日志列表 */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-1.5`}>
          {filtered.map(log => {
            const ac = actionConfig[log.action];
            return (
              <div
                key={log.id}
                onClick={() => setSelectedId(log.id === selectedId ? null : log.id)}
                className={`bg-[#20293F] border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedId === log.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-[#3d4a6a]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${ac.c} flex-shrink-0`}>
                    {ac.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-gray-500 font-mono">{log.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${ac.c}`}>{ac.l}</span>
                      <span className="text-sm text-white truncate">{log.details}</span>
                      {log.result === 'failed' && <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{log.user} ({log.userRole})</span>
                      <span>·</span>
                      <span>{log.ip}</span>
                      <span>·</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-gray-500">资源</div>
                    <div className="text-[10px] text-blue-400 font-mono">{log.resourceId}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 详情 */}
        {selected && (
          <div className="space-y-3">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">审计详情</h3>
                <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-white text-xs">关闭</button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-500 text-[10px]">审计 ID</div>
                  <div className="text-blue-400 font-mono">{selected.id}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-gray-500 text-[10px]">操作人</div>
                    <div className="text-white">{selected.user}</div>
                    <div className="text-[10px] text-gray-500">{selected.userRole}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">来源 IP</div>
                    <div className="text-white font-mono">{selected.ip}</div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">时间</div>
                  <div className="text-white">{selected.timestamp}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">资源</div>
                  <div className="text-white">{selected.resource}</div>
                  <div className="text-blue-400 font-mono text-[10px]">{selected.resourceId}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">操作详情</div>
                  <div className="text-gray-300">{selected.details}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">结果</div>
                  <div className={selected.result === 'success' ? 'text-green-400' : 'text-red-400'}>
                    {selected.result === 'success' ? '✓ 成功' : '✗ 失败'}
                  </div>
                </div>
              </div>
            </div>

            {selected.changes && selected.changes.length > 0 && (
              <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-2">变更对比</h3>
                <div className="space-y-1.5">
                  {selected.changes.map((c, i) => (
                    <div key={i} className="bg-[#111625] rounded p-2 text-xs">
                      <div className="text-gray-500 text-[10px] mb-0.5">{c.field}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">{c.before}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-green-400">{c.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">完整性证明</h3>
              <div className="bg-[#111625] rounded p-2 text-xs">
                <div className="text-gray-500 text-[10px] mb-0.5">SHA-256 哈希</div>
                <div className="text-blue-400 font-mono break-all">{selected.hash}</div>
              </div>
              <div className="mt-2 text-[10px] text-green-400">✓ 哈希链验证通过</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VulnTaskAudit;
