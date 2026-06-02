'use client';

import React, { useState } from 'react';
import { Search, Calendar, User, FileText, Clock, Filter } from 'lucide-react';

interface OpRecord {
  id: string;
  account: string;
  operation: string;
  operator: string;
  opTime: string;
  description: string;
}

const mockData: OpRecord[] = [
  { id: 'OR-001', account: 'admin', operation: '登录', operator: 'admin', opTime: '2026-06-02 10:30:00', description: '管理员登录系统' },
  { id: 'OR-002', account: 'user001', operation: '密码重置', operator: 'system', opTime: '2026-06-02 09:15:00', description: '密码过期自动重置' },
  { id: 'OR-003', account: 'user002', operation: '权限变更', operator: 'admin', opTime: '2026-06-02 08:45:00', description: '提升为普通用户' },
  { id: 'OR-004', account: 'user003', operation: '账号冻结', operator: 'admin', opTime: '2026-06-02 08:00:00', description: '连续失败5次，自动冻结' },
  { id: 'OR-005', account: 'user004', operation: '登录', operator: 'user004', opTime: '2026-06-02 07:30:00', description: '正常登录' },
];

export function AccountOpRecord() {
  const [data] = useState<OpRecord[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [operationFilter, setOperationFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.account.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesOperation = operationFilter === 'all' || item.operation === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const operations = ['登录', '密码重置', '权限变更', '账号冻结', '账号解锁'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">账号操作记录</h2>
        <p className="text-sm text-gray-400 mt-1">账号处理操作的详细日志记录，按账号/操作类型/时间查询</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索账号或操作人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={operationFilter}
                onChange={(e) => setOperationFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">全部操作</option>
                {operations.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">账号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.account}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.operation}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.operator}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.opTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
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