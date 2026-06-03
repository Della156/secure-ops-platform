'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, CheckCircle, XCircle, Clock, FileText, PlayCircle } from 'lucide-react';

interface AuditJob {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'auditing' | 'approved' | 'rejected';
  applicant: string;
  applyTime: string;
  process: string;
  result: string;
}

const mockJobs: AuditJob[] = [
  { id: 'AUD-001', name: '数据库备份作业', type: '数据备份', status: 'auditing', applicant: '张三', applyTime: '2026-06-02 10:30:00', process: '进行中', result: '-' },
  { id: 'AUD-002', name: '服务器重启作业', type: '系统操作', status: 'approved', applicant: '李四', applyTime: '2026-06-02 09:15:00', process: '已完成', result: '通过' },
  { id: 'AUD-003', name: '网络配置修改', type: '网络操作', status: 'pending', applicant: '王五', applyTime: '2026-06-02 08:45:00', process: '待审核', result: '-' },
  { id: 'AUD-004', name: '应用部署作业', type: '应用发布', status: 'rejected', applicant: '赵六', applyTime: '2026-06-02 08:00:00', process: '已驳回', result: '资质不足' },
];

export function JobAuditView() {
  const [jobs] = useState(mockJobs);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchSearch = !searchKeyword || job.name.includes(searchKeyword) || job.applicant.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    auditing: jobs.filter(j => j.status === 'auditing').length,
    approved: jobs.filter(j => j.status === 'approved').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-400 text-sm"><Clock className="w-4 h-4" />待审核</span>;
      case 'auditing':
        return <span className="flex items-center gap-1 text-blue-400 text-sm"><PlayCircle className="w-4 h-4 animate-pulse" />审核中</span>;
      case 'approved':
        return <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />已通过</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle className="w-4 h-4" />已驳回</span>;
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业审核视图</h2>
        <p className="text-sm text-gray-400 mt-1">任务列表展示、过程展示、结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">任务总数</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待审核</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">审核中</p>
          <p className="text-xl font-semibold text-blue-400">{stats.auditing}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已通过</p>
          <p className="text-xl font-semibold text-green-400">{stats.approved}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已驳回</p>
          <p className="text-xl font-semibold text-red-400">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称或申请人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="auditing">审核中</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">作业类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">申请人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">申请时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审核过程</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审核结果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{job.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{job.type}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-300">{job.applicant}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">{job.applyTime}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-300">{job.process}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusDisplay(job.status)}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-medium ${job.result === '通过' ? 'text-green-400' : job.result === '-' ? 'text-gray-500' : 'text-red-400'}`}>
                    {job.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
