'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, RefreshCw, Calendar, Clock, CheckCircle2, AlertCircle, Edit2, Trash2, Play, X } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const plans = [
  { id: 'plan-001', name: '2026年6月安全补丁升级计划', status: 'pending', priority: 'high', scheduledAt: '2026-06-04 02:00', patchCount: 15, affectedAssets: 234 },
  { id: 'plan-002', name: '月度例行补丁更新', status: 'in_progress', priority: 'medium', scheduledAt: '2026-06-03 03:00', patchCount: 8, affectedAssets: 156 },
  { id: 'plan-003', name: '紧急安全补丁部署', status: 'completed', priority: 'critical', scheduledAt: '2026-06-01 01:00', patchCount: 3, affectedAssets: 89 },
  { id: 'plan-004', name: 'Q2季度补丁汇总', status: 'pending', priority: 'low', scheduledAt: '2026-06-15 02:00', patchCount: 45, affectedAssets: 512 },
];

const statusConfig = {
  pending: { label: '待执行', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
  in_progress: { label: '执行中', color: 'bg-blue-500/20 text-blue-400', icon: Play },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
};

const IconComponent = ({ icon: Icon }: { icon: any }) => <Icon className="w-3 h-3" />;

const priorityConfig = {
  critical: { label: '紧急', color: 'bg-red-500/20 text-red-400' },
  high: { label: '高', color: 'bg-orange-500/20 text-orange-400' },
  medium: { label: '中', color: 'bg-yellow-500/20 text-yellow-400' },
  low: { label: '低', color: 'bg-green-500/20 text-green-400' },
};

export function PatchUpgradePlan() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPlans = plans.filter(plan => {
    if (search && !plan.name.includes(search) && !plan.id.includes(search)) return false;
    if (statusFilter && plan.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁升级计划制定" description="管理补丁升级计划"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Plus, label: '新建计划', onClick: () => setIsCreateModalOpen(true) },
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
                placeholder="搜索计划名称或ID"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="pending">待执行</option>
              <option value="in_progress">执行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">计划名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">优先级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">计划执行时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">补丁数量</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">影响资产</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => {
                const status = statusConfig[plan.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <tr key={plan.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                    <td className="py-3 px-4 text-[#F3F4F6] font-medium">{plan.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${priorityConfig[plan.priority as keyof typeof priorityConfig].color}`}>
                        {priorityConfig[plan.priority as keyof typeof priorityConfig].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
                        <IconComponent icon={StatusIcon} />
                        {status.label}
                      </span>
                    </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.scheduledAt}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{plan.patchCount}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{plan.affectedAssets}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#9CA3AF] hover:text-[#0066FF] hover:bg-[#181F32] rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#181F32] rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0D1117] rounded-xl border border-[#2A354D] w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">新建补丁升级计划</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">计划名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="请输入计划名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">优先级</label>
                <select className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]">
                  <option value="critical">紧急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">计划执行时间</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1.5">选择补丁</label>
                <select className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]" multiple>
                  <option value="patch-1">Windows KB5034441</option>
                  <option value="patch-2">Linux Kernel 6.5.0</option>
                  <option value="patch-3">Apache HTTP Server 2.4.58</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-[#2A354D]">
              <button className="flex-1 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors">创建计划</button>
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-[#181F32] text-[#F3F4F6] border border-[#2A354D] rounded-lg hover:bg-[#21262D] transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}