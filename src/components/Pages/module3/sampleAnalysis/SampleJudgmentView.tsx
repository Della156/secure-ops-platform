'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, RefreshCw, FlaskConical, CheckCircle2, AlertTriangle, Clock, FileText } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader } from '@/components/Common/PageStates';

const judgments = [
  { id: 'judge-001', sample: '样本-A-001', md5: 'a1b2c3d4e5f6', status: 'malicious', judgment: '恶意软件', confidence: 95, judgedAt: '2026-06-03 08:00', analyst: '张三' },
  { id: 'judge-002', sample: '样本-B-001', md5: 'b2c3d4e5f6a1', status: 'suspicious', judgment: '可疑文件', confidence: 78, judgedAt: '2026-06-03 07:30', analyst: '李四' },
  { id: 'judge-003', sample: '样本-C-001', md5: 'c3d4e5f6a1b2', status: 'benign', judgment: '良性文件', confidence: 99, judgedAt: '2026-06-03 07:00', analyst: '王五' },
  { id: 'judge-004', sample: '样本-D-001', md5: 'd4e5f6a1b2c3', status: 'pending', judgment: '待判定', confidence: 0, judgedAt: '-', analyst: '-' },
  { id: 'judge-005', sample: '样本-E-001', md5: 'e5f6a1b2c3d4', status: 'malicious', judgment: '勒索软件', confidence: 98, judgedAt: '2026-06-03 06:30', analyst: '赵六' },
];

const statusConfig = {
  malicious: { label: '恶意', color: 'bg-red-500/20 text-red-400' },
  suspicious: { label: '可疑', color: 'bg-yellow-500/20 text-yellow-400' },
  benign: { label: '良性', color: 'bg-green-500/20 text-green-400' },
  pending: { label: '待判定', color: 'bg-gray-500/20 text-gray-400' },
};

export function SampleJudgmentView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredJudgments = judgments.filter(judge => {
    if (search && !judge.sample.includes(search) && !judge.md5.includes(search)) return false;
    if (statusFilter && judge.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: judgments.length,
    malicious: judgments.filter(j => j.status === 'malicious').length,
    suspicious: judgments.filter(j => j.status === 'suspicious').length,
    benign: judgments.filter(j => j.status === 'benign').length,
    pending: judgments.filter(j => j.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="样本判定视图" description="综合展示样本判定任务相关信息"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Plus, label: '新建判定', onClick: () => {} },
        ]}
      />

      <StatsCardGrid>
        <StatsCard title="样本总数" value={stats.total} icon={<FlaskConical className="w-5 h-5" />} />
        <StatsCard title="恶意样本" value={stats.malicious} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="可疑样本" value={stats.suspicious} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" />
        <StatsCard title="良性样本" value={stats.benign} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
      </StatsCardGrid>

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
                placeholder="搜索样本名称或MD5"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部状态</option>
              <option value="malicious">恶意</option>
              <option value="suspicious">可疑</option>
              <option value="benign">良性</option>
              <option value="pending">待判定</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">样本名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">MD5值</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">判定结果</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">置信度</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">判定时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#9CA3AF]">分析人员</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#9CA3AF]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredJudgments.map(judge => (
                <tr key={judge.id} className="border-b border-[#2A354D] hover:bg-[#181F32]">
                  <td className="py-3 px-4 text-[#F3F4F6] flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#0066FF]" />
                    {judge.sample}
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF] font-mono text-sm">{judge.md5}</td>
                  <td className="py-3 px-4 text-[#F3F4F6]">{judge.judgment}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${judge.confidence >= 90 ? 'bg-[#EF4444]' : judge.confidence >= 70 ? 'bg-[#F59E0B]' : judge.confidence > 0 ? 'bg-[#00D4AA]' : 'bg-[#6E7681]'}`}
                          style={{ width: `${judge.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#F3F4F6]">{judge.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={judge.status} config={statusConfig} />
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {judge.judgedAt}
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{judge.analyst}</td>
                  <td className="py-3 px-4">
                    <button className="flex items-center gap-1 text-sm text-[#0066FF] hover:text-[#0080FF]">
                      <FileText className="w-4 h-4" />
                      <span>查看报告</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}