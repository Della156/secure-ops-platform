'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface AuditPlan {
  id: string;
  planName: string;
  creator: string;
  type: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  submitTime: string;
  updateTime: string;
  complianceIssues: number;
  integrityIssues: number;
}

const mockData: AuditPlan[] = [
  { id: 'JPA-001', planName: '系统补丁升级方案', creator: '张工', type: '变更方案', status: 'in_progress', submitTime: '2026-06-02 09:00:00', updateTime: '2026-06-02 10:15:00', complianceIssues: 1, integrityIssues: 0 },
  { id: 'JPA-002', planName: '网络架构优化方案', creator: '李工', type: '变更方案', status: 'approved', submitTime: '2026-06-01 14:00:00', updateTime: '2026-06-01 17:30:00', complianceIssues: 0, integrityIssues: 0 },
  { id: 'JPA-003', planName: '数据库迁移方案', creator: '王工', type: '变更方案', status: 'rejected', submitTime: '2026-06-01 10:00:00', updateTime: '2026-06-01 14:00:00', complianceIssues: 3, integrityIssues: 2 },
  { id: 'JPA-004', planName: '安全加固方案', creator: '赵工', type: '加固方案', status: 'pending', submitTime: '2026-06-02 08:00:00', updateTime: '-', complianceIssues: 0, integrityIssues: 0 },
  { id: 'JPA-005', planName: '灾备演练方案', creator: '钱工', type: '演练方案', status: 'approved', submitTime: '2026-05-30 16:00:00', updateTime: '2026-05-31 10:00:00', complianceIssues: 0, integrityIssues: 0 },
  { id: 'JPA-006', planName: '监控告警优化方案', creator: '孙工', type: '优化方案', status: 'in_progress', submitTime: '2026-06-02 07:00:00', updateTime: '2026-06-02 09:30:00', complianceIssues: 0, integrityIssues: 1 },
];

export function JobPlanAuditView() {
  const [data] = useState<AuditPlan[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.planName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    inProgress: data.filter(d => d.status === 'in_progress').length,
    approved: data.filter(d => d.status === 'approved').length,
    rejected: data.filter(d => d.status === 'rejected').length,
    totalIssues: data.reduce((sum, d) => sum + d.complianceIssues + d.integrityIssues, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />已通过</span>;
    if (status === 'rejected') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />已驳回</span>;
    if (status === 'in_progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><Clock className="w-3 h-3 inline mr-1" />审核中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待审核</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案审核视图</h2>
        <p className="text-sm text-gray-400 mt-1">作业方案审核任务列表展示、审核过程展示、审核结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">方案总数</p>
          <p className="text-xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待审核</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">审核中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">已驳回</p>
              <p className="text-xl font-semibold text-red-400">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">问题数</p>
              <p className="text-xl font-semibold text-orange-400">{stats.totalIssues}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索方案名称或创建人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="in_progress">审核中</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">全部类型</option>
                <option value="变更方案">变更方案</option>
                <option value="加固方案">加固方案</option>
                <option value="演练方案">演练方案</option>
                <option value="优化方案">优化方案</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">方案名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">创建人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规性问题</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">完整性问题</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">提交时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">{item.planName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.creator}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.type}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${item.complianceIssues > 0 ? 'text-red-400' : 'text-green-400'}`}>{item.complianceIssues}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${item.integrityIssues > 0 ? 'text-red-400' : 'text-green-400'}`}>{item.integrityIssues}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.submitTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.updateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}