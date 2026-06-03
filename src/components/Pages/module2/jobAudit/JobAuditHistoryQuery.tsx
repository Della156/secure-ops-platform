'use client';

import React, { useState } from 'react';
import { Search, Filter, Calendar, Eye, FileText, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface AuditHistory {
  id: string;
  name: string;
  type: string;
  applicant: string;
  applyTime: string;
  auditor: string;
  auditTime: string;
  status: 'approved' | 'rejected';
  comments: string;
}

const mockHistory: AuditHistory[] = [
  {
    id: 'AUD-2024-001',
    name: '核心数据库备份',
    type: '数据备份',
    applicant: '张三',
    applyTime: '2026-06-01 10:30:00',
    auditor: '审核员A',
    auditTime: '2026-06-01 11:00:00',
    status: 'approved',
    comments: '符合流程，同意执行',
  },
  {
    id: 'AUD-2024-002',
    name: '应用服务器重启',
    type: '系统操作',
    applicant: '李四',
    applyTime: '2026-06-01 09:15:00',
    auditor: '审核员B',
    auditTime: '2026-06-01 09:30:00',
    status: 'approved',
    comments: '已确认维护窗口，同意',
  },
  {
    id: 'AUD-2024-003',
    name: '网络配置调整',
    type: '网络操作',
    applicant: '王五',
    applyTime: '2026-05-31 14:00:00',
    auditor: '审核员A',
    auditTime: '2026-05-31 14:30:00',
    status: 'rejected',
    comments: '缺少应急预案，请补充后重新申请',
  },
  {
    id: 'AUD-2024-004',
    name: '安全策略更新',
    type: '安全操作',
    applicant: '赵六',
    applyTime: '2026-05-30 16:00:00',
    auditor: '审核员C',
    auditTime: '2026-05-30 16:45:00',
    status: 'approved',
    comments: '安全团队已评审，同意',
  },
  {
    id: 'AUD-2024-005',
    name: '日志清理作业',
    type: '日常维护',
    applicant: '钱七',
    applyTime: '2026-05-29 08:30:00',
    auditor: '审核员B',
    auditTime: '2026-05-29 09:00:00',
    status: 'approved',
    comments: '常规操作，同意',
  },
];

export function JobAuditHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRecord, setSelectedRecord] = useState<AuditHistory | null>(null);

  const filteredHistory = history.filter(record => {
    const matchSearch = !searchKeyword ||
      record.name.includes(searchKeyword) ||
      record.applicant.includes(searchKeyword) ||
      record.auditor.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />已通过</span>;
    }
    return <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle className="w-4 h-4" />已驳回</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业审核任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史记录查询、详情查看、意见查询</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索任务名称、申请人或审核人..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
                <span className="text-gray-500">至</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111827]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">申请人</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审核人</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审核时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredHistory.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`hover:bg-[#2A354D]/30 cursor-pointer ${selectedRecord?.id === record.id ? 'bg-blue-500/10' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{record.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{record.applicant}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{record.auditor}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-400">{record.auditTime}</span>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-4 py-4">
                      <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedRecord ? (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                审核详情
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">任务编号</p>
                  <p className="text-sm text-white">{selectedRecord.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">任务名称</p>
                  <p className="text-sm text-white">{selectedRecord.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">作业类型</p>
                  <p className="text-sm text-white">{selectedRecord.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">申请人</p>
                    <p className="text-sm text-white">{selectedRecord.applicant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">审核人</p>
                    <p className="text-sm text-white">{selectedRecord.auditor}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">申请时间</p>
                    <p className="text-sm text-gray-300">{selectedRecord.applyTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">审核时间</p>
                    <p className="text-sm text-gray-300">{selectedRecord.auditTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">审核结果</p>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div className="border-t border-[#2A354D] pt-4">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    审核意见
                  </p>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-sm text-gray-300">{selectedRecord.comments}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-gray-500">请选择一条记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
