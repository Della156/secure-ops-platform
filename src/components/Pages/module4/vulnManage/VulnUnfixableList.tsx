'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Download, Plus, Shield, AlertTriangle, Clock, FileText,
  Check, X, Eye, Edit, Filter, Calendar, User, ChevronRight,
  CheckCircle2, XCircle, AlertCircle, Layers, Tag, Building
} from 'lucide-react';

/**
 * 4.6-8 无法整改漏洞清单管理
 *
 * 无法修复漏洞的审批 / 风险接受：
 * - 申请原因：业务依赖 / 厂商未提供补丁 / 影响性能等
 * - 风险评估
 * - 多级审批流
 * - 临时补偿措施
 */

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface UnfixableVuln {
  id: string;
  vulnName: string;
  cve?: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  asset: string;
  ip: string;
  businessOwner: string;
  reason: string;
  reasonType: 'business' | 'no_patch' | 'performance' | 'compatibility' | 'planned_replace';
  mitigation: string[];
  deadline: string; // 临时豁免到期日
  status: ApprovalStatus;
  approvers: { role: string; approver: string; status: 'pending' | 'approved' | 'rejected'; time?: string; comment?: string }[];
  appliedAt: string;
  appliedBy: string;
  expiry?: string;
  riskScore: number; // 风险评分
}

const unfixableList: UnfixableVuln[] = [
  {
    id: 'UF-2026-0001',
    vulnName: 'WordPress 旧版插件 RCE',
    cve: 'CVE-2024-31210',
    level: 'high',
    cvss: 7.5,
    asset: 'WEB-CMS-01',
    ip: '10.1.40.10',
    businessOwner: '李娜',
    reason: '业务系统依赖该插件的特定功能，且插件厂商暂未发布兼容补丁，强制升级会导致业务中断',
    reasonType: 'business',
    mitigation: ['启用 WAF 拦截', '限制插件访问范围', '开启详细日志审计', '限制源 IP 访问'],
    deadline: '2026-08-30',
    status: 'approved',
    approvers: [
      { role: '业务负责人', approver: '李娜', status: 'approved', time: '2026-05-10 14:00', comment: '已确认业务影响' },
      { role: '安全负责人', approver: '张伟', status: 'approved', time: '2026-05-11 10:00', comment: '接受风险，已部署补偿措施' },
      { role: '公司管理层', approver: 'CTO 王总', status: 'approved', time: '2026-05-12 16:00', comment: '同意，限期 3 个月内下线' },
    ],
    appliedAt: '2026-05-10 11:30',
    appliedBy: '李娜',
    expiry: '2026-08-30',
    riskScore: 6.5,
  },
  {
    id: 'UF-2026-0002',
    vulnName: '老旧 Windows Server 2008 SMB 漏洞',
    cve: 'CVE-2017-0144',
    level: 'critical',
    cvss: 8.1,
    asset: 'OLD-DB-01',
    ip: '10.1.99.5',
    businessOwner: '周九',
    reason: '设备已停产，硬件老化无法升级操作系统，业务系统迁移计划在 Q4 执行，迁移前无法下线',
    reasonType: 'planned_replace',
    mitigation: ['网络隔离（DMZ）', '关闭 SMB v1', '限制访问源 IP', '部署 IPS'],
    deadline: '2026-12-31',
    status: 'approved',
    approvers: [
      { role: '业务负责人', approver: '周九', status: 'approved', time: '2026-04-15 09:00' },
      { role: '安全负责人', approver: '张伟', status: 'approved', time: '2026-04-16 14:00', comment: '迁移计划已确认' },
      { role: '公司管理层', approver: 'CTO 王总', status: 'pending' },
    ],
    appliedAt: '2026-04-15 08:30',
    appliedBy: '周九',
    expiry: '2026-12-31',
    riskScore: 7.8,
  },
  {
    id: 'UF-2026-0003',
    vulnName: 'SSL TLS 1.0 启用',
    level: 'medium',
    cvss: 5.0,
    asset: 'OLD-WEB-01',
    ip: '10.1.99.20',
    businessOwner: '孙八',
    reason: '关闭 TLS 1.0 后部分老旧客户端无法连接，影响业务',
    reasonType: 'compatibility',
    mitigation: ['部署 WAF 终止 TLS', '监控异常流量'],
    deadline: '2026-07-30',
    status: 'pending',
    approvers: [
      { role: '业务负责人', approver: '孙八', status: 'approved', time: '2026-05-20 10:00' },
      { role: '安全负责人', approver: '张伟', status: 'pending' },
      { role: '公司管理层', approver: 'CTO 王总', status: 'pending' },
    ],
    appliedAt: '2026-05-20 09:00',
    appliedBy: '孙八',
    riskScore: 4.5,
  },
  {
    id: 'UF-2026-0004',
    vulnName: 'Apache Struts 2 远程代码执行',
    cve: 'CVE-2023-50164',
    level: 'critical',
    cvss: 9.8,
    asset: 'BIZ-SYS-01',
    ip: '10.1.50.10',
    businessOwner: '钱七',
    reason: '应用层与 Struts 深度耦合，升级会导致业务中断',
    reasonType: 'no_patch',
    mitigation: ['WAF 规则阻断', '应用白名单', '网络访问控制'],
    deadline: '2026-06-30',
    status: 'rejected',
    approvers: [
      { role: '业务负责人', approver: '钱七', status: 'approved', time: '2026-05-25 11:00' },
      { role: '安全负责人', approver: '张伟', status: 'rejected', time: '2026-05-26 14:00', comment: 'CVSS 9.8 不接受风险接受，必须修复' },
    ],
    appliedAt: '2026-05-25 10:00',
    appliedBy: '钱七',
    riskScore: 9.2,
  },
  {
    id: 'UF-2026-0005',
    vulnName: '弱口令 admin/admin',
    level: 'high',
    cvss: 6.0,
    asset: 'CAMERA-01',
    ip: '10.1.60.5',
    businessOwner: '运维部',
    reason: '监控摄像头设备，无法修改默认口令',
    reasonType: 'business',
    mitigation: ['网络隔离（VLAN）', '访问控制', '定期密码轮换'],
    deadline: '2027-01-01',
    status: 'approved',
    approvers: [
      { role: '业务负责人', approver: '王强', status: 'approved', time: '2026-03-15 10:00' },
      { role: '安全负责人', approver: '张伟', status: 'approved', time: '2026-03-16 11:00' },
    ],
    appliedAt: '2026-03-15 09:00',
    appliedBy: '王强',
    expiry: '2027-01-01',
    riskScore: 5.5,
  },
  {
    id: 'UF-2026-0006',
    vulnName: 'WebLogic 反序列化漏洞',
    cve: 'CVE-2023-21839',
    level: 'critical',
    cvss: 9.8,
    asset: 'APP-MIDDLEWARE-03',
    ip: '10.1.30.45',
    businessOwner: '王强',
    reason: '补丁与业务不兼容',
    reasonType: 'compatibility',
    mitigation: ['关闭 T3 协议', 'WAF 规则'],
    deadline: '2026-06-15',
    status: 'expired',
    approvers: [
      { role: '业务负责人', approver: '王强', status: 'approved', time: '2026-05-01 10:00' },
      { role: '安全负责人', approver: '张伟', status: 'approved', time: '2026-05-02 14:00' },
    ],
    appliedAt: '2026-05-01 09:00',
    appliedBy: '王强',
    expiry: '2026-05-15',
    riskScore: 8.5,
  },
];

const statusConfig: Record<ApprovalStatus, { l: string; c: string }> = {
  pending: { l: '审批中', c: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  approved: { l: '已通过', c: 'bg-green-500/10 text-green-400 border-green-500/30' },
  rejected: { l: '已驳回', c: 'bg-red-500/10 text-red-400 border-red-500/30' },
  expired: { l: '已过期', c: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
};

const reasonLabels: Record<string, { l: string; c: string }> = {
  business: { l: '业务依赖', c: 'text-blue-400 bg-blue-500/10' },
  no_patch: { l: '无补丁', c: 'text-red-400 bg-red-500/10' },
  performance: { l: '性能影响', c: 'text-orange-400 bg-orange-500/10' },
  compatibility: { l: '兼容性问题', c: 'text-purple-400 bg-purple-500/10' },
  planned_replace: { l: '计划替换', c: 'text-green-400 bg-green-500/10' },
};

const severityColors = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
};

export function VulnUnfixableList() {
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'expired'>('all');
  const [searchKw, setSearchKw] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return unfixableList.filter(v => {
      if (tab !== 'all' && v.status !== tab) return false;
      if (searchKw && !v.vulnName.includes(searchKw) && !v.cve?.includes(searchKw) && !v.asset.includes(searchKw)) return false;
      return true;
    });
  }, [tab, searchKw]);

  const selected = unfixableList.find(v => v.id === selectedId);
  const totalCount = unfixableList.length;
  const approvedCount = unfixableList.filter(v => v.status === 'approved').length;
  const pendingCount = unfixableList.filter(v => v.status === 'pending').length;
  const expiredCount = unfixableList.filter(v => v.status === 'expired').length;

  return (
    <div className="space-y-4">
      {/* 顶部 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            无法整改漏洞清单
          </h2>
          <span className="text-xs text-gray-500">共 {totalCount} 个风险接受项</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新增申请
          </button>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '总申请数', value: totalCount, color: 'blue', icon: <Shield className="w-4 h-4" /> },
          { label: '已批准', value: approvedCount, color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: '审批中', value: pendingCount, color: 'yellow', icon: <Clock className="w-4 h-4" /> },
          { label: '已过期', value: expiredCount, color: 'red', icon: <AlertTriangle className="w-4 h-4" />, sub: '需立即处理' },
        ].map((k, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
            <div className={`text-${k.color}-400 mb-2`}>{k.icon}</div>
            <div className="text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            {k.sub && <div className="text-[10px] text-gray-500 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-[#2A354D]">
        {[
          { v: 'all' as const, l: '全部', count: totalCount },
          { v: 'pending' as const, l: '审批中', count: pendingCount },
          { v: 'approved' as const, l: '已通过', count: approvedCount },
          { v: 'rejected' as const, l: '已驳回', count: unfixableList.filter(v => v.status === 'rejected').length },
          { v: 'expired' as const, l: '已过期', count: expiredCount },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={`px-4 py-2 text-sm border-b-2 ${tab === t.v ? 'border-blue-500 text-white' : 'border-transparent text-gray-500'}`}
          >
            {t.l} <span className="text-[10px] text-gray-500">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 列表 */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-2`}>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                placeholder="搜索漏洞 / 资产..."
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded pl-8 pr-2 py-1.5"
              />
            </div>
          </div>
          {filtered.map(v => {
            const status = statusConfig[v.status];
            const reason = reasonLabels[v.reasonType];
            const allApproved = v.approvers.every(a => a.status === 'approved');
            const someRejected = v.approvers.some(a => a.status === 'rejected');
            return (
              <div
                key={v.id}
                onClick={() => setSelectedId(v.id === selectedId ? null : v.id)}
                className={`bg-[#20293F] border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedId === v.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-[#3d4a6a]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-500 font-mono">{v.id}</span>
                      <span className={`text-sm font-medium ${severityColors[v.level]}`}>{v.vulnName}</span>
                      {v.cve && <span className="text-[10px] text-gray-500 font-mono">{v.cve}</span>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {v.asset} (<span className="font-mono">{v.ip}</span>) · 业务负责人: {v.businessOwner}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${status.c}`}>{status.l}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${reason.c}`}>{reason.l}</span>
                  <span className="text-[10px] text-gray-500">CVSS {v.cvss.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-500">风险评分 {v.riskScore}</span>
                  <span className="text-[10px] text-orange-400">到期 {v.deadline}</span>
                </div>

                <div className="text-xs text-gray-400 line-clamp-2 mb-2">
                  <span className="text-gray-500">原因：</span>{v.reason}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-[#2A354D]">
                  <span>审批进度: {v.approvers.filter(a => a.status === 'approved').length}/{v.approvers.length}</span>
                  <span>申请时间: {v.appliedAt}</span>
                </div>

                {someRejected && (
                  <div className="mt-2 text-[10px] text-red-400">⚠ 申请被驳回</div>
                )}
                {v.status === 'expired' && (
                  <div className="mt-2 text-[10px] text-red-400">⚠ 风险接受已过期，请立即处理</div>
                )}
              </div>
            );
          })}
        </div>

        {/* 详情 */}
        {selected && (
          <div className="space-y-3">
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">申请详情</h3>
                <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-500 text-[10px]">漏洞名称</div>
                  <div className="text-white font-medium">{selected.vulnName}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-gray-500 text-[10px]">等级</div>
                    <div className={severityColors[selected.level]}>{selected.level.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">CVSS</div>
                    <div className="text-white font-bold">{selected.cvss.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">资产</div>
                    <div className="text-white">{selected.asset}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px]">到期日</div>
                    <div className="text-orange-400">{selected.deadline}</div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">无法修复原因</div>
                  <div className="text-gray-300 mt-0.5">{selected.reason}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">补偿措施</div>
                  <ul className="mt-0.5 space-y-0.5">
                    {selected.mitigation.map((m, i) => (
                      <li key={i} className="text-gray-300 flex items-start gap-1">
                        <span className="text-blue-400">▸</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3">审批流</h3>
              <div className="space-y-3">
                {selected.approvers.map((a, i) => {
                  const iconColor = a.status === 'approved' ? 'text-green-400 bg-green-500/20' : a.status === 'rejected' ? 'text-red-400 bg-red-500/20' : 'text-gray-400 bg-gray-500/20';
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${iconColor}`}>
                        {a.status === 'approved' ? <Check className="w-3.5 h-3.5" /> : a.status === 'rejected' ? <X className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs">
                          <span className="text-white">{a.approver}</span>
                          <span className="text-gray-500 ml-2">({a.role})</span>
                        </div>
                        {a.comment && <div className="text-[10px] text-gray-400 mt-0.5 italic">"{a.comment}"</div>}
                        {a.time && <div className="text-[10px] text-gray-500 mt-0.5">{a.time}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VulnUnfixableList;
