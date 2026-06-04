'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, CheckCircle2, AlertCircle, Server, FileText, ArrowRight, RefreshCw as RefreshIcon } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const verifications = [
  { id: 'v-001', patch: 'Windows KB5034441', asset: 'web-server-01', status: 'success', verifiedAt: '2026-06-04 02:10', details: '补丁安装验证通过' },
  { id: 'v-002', patch: 'Windows KB5034441', asset: 'db-server-01', status: 'success', verifiedAt: '2026-06-04 02:15', details: '补丁安装验证通过' },
  { id: 'v-003', patch: 'Linux Kernel 6.5.0', asset: 'cdn-node-01', status: 'success', verifiedAt: '2026-06-04 02:20', details: '补丁安装验证通过' },
  { id: 'v-004', patch: 'Linux Kernel 6.5.0', asset: 'api-gateway-01', status: 'failed', verifiedAt: '2026-06-04 02:05', details: '验证失败：服务未启动' },
  { id: 'v-005', patch: 'Apache HTTP Server 2.4.58', asset: 'web-proxy-01', status: 'pending', verifiedAt: '', details: '等待验证' },
];

const statusConfig = {
  success: { label: '验证通过', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  failed: { label: '验证失败', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
  pending: { label: '待验证', color: 'bg-gray-500/20 text-gray-400', icon: RefreshIcon },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function PatchUpgradeVerify() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredVerifications = verifications.filter(v => {
    if (search && !v.patch.includes(search) && !v.asset.includes(search)) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: verifications.length,
    success: verifications.filter(v => v.status === 'success').length,
    failed: verifications.filter(v => v.status === 'failed').length,
    pending: verifications.filter(v => v.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁升级结果验证" description="验证补丁升级结果"
        actions={[
          { icon: RefreshCw, label: '重新验证', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">验证总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">验证通过</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.success}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">验证失败</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.failed}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <RefreshIcon className="w-5 h-5 text-[#9CA3AF]" />
            <span className="text-sm text-[#9CA3AF]">待验证</span>
          </div>
          <div className="text-2xl font-semibold text-[#9CA3AF]">{stats.pending}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="搜索补丁或资产"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="success">验证通过</option>
              <option value="failed">验证失败</option>
              <option value="pending">待验证</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">补丁名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">目标资产</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">验证状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">验证时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">验证详情</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.map(v => {
                const status = statusConfig[v.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={v.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6]">{v.patch}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-[#F3F4F6]">{v.asset}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
                        <IconComponent icon={StatusIcon} />
                        {status.label}
                      </span>
                    </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{v.verifiedAt || '-'}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{v.details}</td>
                  <td className="py-3 px-4">
                    <button className="flex items-center gap-1 text-sm text-[#0066FF] hover:text-[#0080FF]">
                      <span>查看报告</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}