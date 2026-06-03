'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, History, GitCompare, Calendar } from 'lucide-react';

interface AuditHistory {
  id: string;
  planName: string;
  planId: string;
  version: string;
  creator: string;
  auditor: string;
  status: 'approved' | 'rejected';
  auditTime: string;
  submitTime: string;
  comments: string;
  complianceIssues: number;
  integrityIssues: number;
}

const mockHistory: AuditHistory[] = [
  { id: 'HIS-001', planName: '系统补丁升级方案', planId: 'JPA-001', version: 'v1.0', creator: '张工', auditor: '李经理', status: 'approved', auditTime: '2026-06-02 10:15:00', submitTime: '2026-06-02 09:00:00', comments: '方案完整，合规性良好，同意通过', complianceIssues: 0, integrityIssues: 0 },
  { id: 'HIS-002', planName: '网络架构优化方案', planId: 'JPA-002', version: 'v2.1', creator: '王工', auditor: '赵经理', status: 'approved', auditTime: '2026-06-01 17:30:00', submitTime: '2026-06-01 14:00:00', comments: '已按要求修改，批准实施', complianceIssues: 0, integrityIssues: 0 },
  { id: 'HIS-003', planName: '网络架构优化方案', planId: 'JPA-002', version: 'v2.0', creator: '王工', auditor: '赵经理', status: 'rejected', auditTime: '2026-05-31 15:00:00', submitTime: '2026-05-31 10:00:00', comments: '缺少风险评估报告，请补充', complianceIssues: 1, integrityIssues: 2 },
  { id: 'HIS-004', planName: '数据库迁移方案', planId: 'JPA-003', version: 'v1.2', creator: '李工', auditor: '钱经理', status: 'approved', auditTime: '2026-05-30 11:00:00', submitTime: '2026-05-30 09:00:00', comments: '方案合理，回滚方案完善', complianceIssues: 0, integrityIssues: 0 },
  { id: 'HIS-005', planName: '数据库迁移方案', planId: 'JPA-003', version: 'v1.1', creator: '李工', auditor: '钱经理', status: 'rejected', auditTime: '2026-05-29 16:30:00', submitTime: '2026-05-29 14:00:00', comments: '回滚方案不明确', complianceIssues: 0, integrityIssues: 1 },
  { id: 'HIS-006', planName: '安全加固方案', planId: 'JPA-004', version: 'v1.0', creator: '赵工', auditor: '孙经理', status: 'approved', auditTime: '2026-05-28 14:00:00', submitTime: '2026-05-28 10:00:00', comments: '符合安全规范要求', complianceIssues: 0, integrityIssues: 0 },
];

export function PlanAuditHistoryQuery() {
  const [data] = useState<AuditHistory[]>(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRecord, setSelectedRecord] = useState<AuditHistory | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.planName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.auditor.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesDate = (!dateRange.start || new Date(item.auditTime) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(item.auditTime) <= new Date(dateRange.end));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已通过</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">已驳回</span>;
  };

  const showDetail = (record: AuditHistory) => {
    setSelectedRecord(record);
  };

  const closeDetail = () => {
    setSelectedRecord(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案审核任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">审核任务历史记录查询、详情查看、版本比对</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索方案名称、创建人、审核人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
              <option value="approved">已通过</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              placeholder="开始日期"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              placeholder="结束日期"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">方案名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">创建人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">审核人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">提交时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">审核时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">{item.planName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">{item.version}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.creator}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.auditor}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.submitTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.auditTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => showDetail(item)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 rounded transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        详情
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 text-xs bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 rounded transition-colors">
                        <GitCompare className="w-3 h-3" />
                        比对
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2332] border border-[#2A354D] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-white">审核详情</h3>
              <button onClick={closeDetail} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">方案名称</p>
                  <p className="text-white text-sm">{selectedRecord.planName}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">版本</p>
                  <p className="text-white text-sm">{selectedRecord.version}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">创建人</p>
                  <p className="text-white text-sm">{selectedRecord.creator}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">审核人</p>
                  <p className="text-white text-sm">{selectedRecord.auditor}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">提交时间</p>
                  <p className="text-white text-sm">{selectedRecord.submitTime}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">审核时间</p>
                  <p className="text-white text-sm">{selectedRecord.auditTime}</p>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">审核状态</p>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div className="bg-[#131B2A] p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">发现问题</p>
                  <p className="text-white text-sm">
                    合规性问题：<span className={selectedRecord.complianceIssues > 0 ? 'text-red-400' : 'text-green-400'}>{selectedRecord.complianceIssues}</span>，
                    完整性问题：<span className={selectedRecord.integrityIssues > 0 ? 'text-red-400' : 'text-green-400'}>{selectedRecord.integrityIssues}</span>
                  </p>
                </div>
              </div>
              <div className="bg-[#131B2A] p-3 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">审核意见</p>
                <p className="text-gray-300 text-sm">{selectedRecord.comments}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}