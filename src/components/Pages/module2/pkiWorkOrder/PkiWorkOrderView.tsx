'use client';

import React, { useState } from 'react';
import { Search, Calendar, Download, Filter, FileText, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react';

interface WorkOrderItem {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  createTime: string;
  assignee: string;
  type: string;
  certType: string;
}

const mockOrders: WorkOrderItem[] = [
  { id: 'PKI-001', title: '颁发SSL证书', status: 'processing', createTime: '2026-06-02 09:00:00', assignee: '张三', type: '证书颁发', certType: 'SSL证书' },
  { id: 'PKI-002', title: '员工入职证书配置', status: 'completed', createTime: '2026-06-01 14:30:00', assignee: '李四', type: '账号创建', certType: '客户端证书' },
  { id: 'PKI-003', title: '证书续期', status: 'pending', createTime: '2026-06-02 10:00:00', assignee: '王五', type: '证书续期', certType: '代码签名证书' },
];

export function PkiWorkOrderView() {
  const [orders] = useState(mockOrders);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredOrders = orders.filter(order => 
    !searchKeyword || order.title.includes(searchKeyword) || order.id.includes(searchKeyword)
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">PKI工单视图</h2>
        <p className="text-sm text-gray-400 mt-1">工单任务列表展示、处理过程展示、处理结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总工单</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待处理</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">处理中</p>
          <p className="text-xl font-semibold text-blue-400">{stats.processing}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">已完成</p>
          <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索工单标题或ID..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">工单ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">证书类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">处理人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">创建时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400">{order.id}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{order.title}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{order.type}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{order.certType}</td>
                <td className="px-4 py-4">
                  {order.status === 'pending' && <span className="flex items-center gap-1 text-yellow-400 text-sm"><Clock className="w-4 h-4" />待处理</span>}
                  {order.status === 'processing' && <span className="flex items-center gap-1 text-blue-400 text-sm"><AlertTriangle className="w-4 h-4" />处理中</span>}
                  {order.status === 'completed' && <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />已完成</span>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{order.assignee}</td>
                <td className="px-4 py-4 text-sm text-gray-400">{order.createTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}