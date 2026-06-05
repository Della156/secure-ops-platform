'use client';
import React, { useState } from 'react';
import { Search, Filter, Play, RefreshCw, Smartphone, CheckCircle2, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const scanResults = [
  { id: 'scan-001', endpoint: 'PC-WIN-001', status: 'passed', checks: 15, passed: 15, failed: 0, startTime: '08:00:00', endTime: '08:02:35' },
  { id: 'scan-002', endpoint: 'PC-WIN-002', status: 'passed', checks: 15, passed: 15, failed: 0, startTime: '08:03:00', endTime: '08:05:20' },
  { id: 'scan-003', endpoint: 'PC-MAC-001', status: 'warning', checks: 15, passed: 12, failed: 3, startTime: '08:06:00', endTime: '08:08:45' },
  { id: 'scan-004', endpoint: 'PC-LIN-001', status: 'failed', checks: 15, passed: 5, failed: 10, startTime: '08:09:00', endTime: '08:10:15' },
  { id: 'scan-005', endpoint: 'LAPTOP-001', status: 'in_progress', checks: 15, passed: 8, failed: 0, startTime: '08:11:00', endTime: '' },
];

const statusConfig = {
  passed: { label: '通过', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  warning: { label: '警告', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  in_progress: { label: '扫描中', color: 'bg-blue-500/20 text-blue-400', icon: Loader2 },
};

const IconComponent = ({ icon: Icon }: { icon: any }) => <Icon className="w-3 h-3" />;

export function EndpointComplianceScan() {
  const [search, setSearch] = useState('');

  const filteredResults = scanResults.filter(result => {
    if (search && !result.endpoint.includes(search)) return false;
    return true;
  });

  const stats = {
    total: scanResults.length,
    passed: scanResults.filter(r => r.status === 'passed').length,
    warning: scanResults.filter(r => r.status === 'warning').length,
    failed: scanResults.filter(r => r.status === 'failed').length,
    inProgress: scanResults.filter(r => r.status === 'in_progress').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="终端合规扫描" description="执行终端合规扫描任务"
        actions={[
          { icon: Play, label: '开始扫描', onClick: () => {} },
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">扫描总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">通过</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.passed}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">警告</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.warning}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">失败</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.failed}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">扫描中</span>
          </div>
          <div className="text-2xl font-semibold text-[#0066FF]">{stats.inProgress}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              placeholder="搜索终端名称"
            />
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredResults.map(result => {
            const config = statusConfig[result.status as keyof typeof statusConfig];
            const Icon = config.icon;
            return (
              <div key={result.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#181F32]">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-8 h-8 text-[#0066FF]" />
                  <div>
                    <div className="font-medium text-[#F3F4F6]">{result.endpoint}</div>
                    <div className="text-sm text-[#9CA3AF]">检测项: {result.checks} | 通过: {result.passed} | 失败: {result.failed}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                    {result.status === 'in_progress' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <IconComponent icon={Icon} />
                    )}
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-right">
                    <div className="text-xs text-[#9CA3AF]">开始: {result.startTime}</div>
                    <div className="text-xs text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      结束: {result.endTime || '-'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}