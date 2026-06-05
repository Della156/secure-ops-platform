'use client';
import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, Clock, User, Package, FileCheck } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const audits = [
  { id: 'audit-001', task: 'Windows 补丁批量更新', operator: '张三', action: '启动任务', time: '2026-06-03 08:00:00', result: 'success' },
  { id: 'audit-002', task: 'Windows 补丁批量更新', operator: '系统', action: '补丁下载完成', time: '2026-06-03 08:05:00', result: 'success' },
  { id: 'audit-003', task: 'Windows 补丁批量更新', operator: '系统', action: '开始部署到主机', time: '2026-06-03 08:06:00', result: 'success' },
  { id: 'audit-004', task: 'Windows 补丁批量更新', operator: '系统', action: '主机 PC-WIN-001 更新失败', time: '2026-06-03 08:15:00', result: 'failed' },
  { id: 'audit-005', task: 'Linux 安全补丁部署', operator: '李四', action: '启动任务', time: '2026-06-03 07:30:00', result: 'success' },
  { id: 'audit-006', task: 'Linux 安全补丁部署', operator: '系统', action: '部署完成', time: '2026-06-03 07:45:00', result: 'success' },
];

const resultConfig = {
  success: { label: '成功', color: 'bg-green-500/20 text-green-400' },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400' },
};

export function PatchManagementAudit() {
  const [search, setSearch] = useState('');

  const filteredAudits = audits.filter(item => {
    if (search && !item.task.includes(search) && !item.operator.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁管理任务审计" description="审计补丁管理任务操作记录"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Download, label: '导出', onClick: () => {} },
        ]}
      />

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
                placeholder="搜索任务或操作人"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg">
              <Calendar className="w-4 h-4 text-[#6E7681]" />
              <input
                type="date"
                className="bg-transparent text-[#F3F4F6] focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">任务名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作人</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作动作</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">结果</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map(item => {
                const config = resultConfig[item.result as keyof typeof resultConfig];
                return (
                  <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#0066FF]" />
                      {item.task}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="text-[#F3F4F6]">{item.operator}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{item.action}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        {config.label}
                      </span>
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