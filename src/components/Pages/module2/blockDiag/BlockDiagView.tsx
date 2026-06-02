'use client';

import React, { useState } from 'react';
import { Search, Calendar, Download, Filter, AlertTriangle, CheckCircle, Clock, Activity, Shield } from 'lucide-react';

interface BlockDiagTask {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createTime: string;
  target: string;
  type: string;
}

const mockTasks: BlockDiagTask[] = [
  { id: 'BLOCK-DIAG-001', title: '异常阻断流量诊断', status: 'processing', createTime: '2026-06-02 09:00:00', target: 'Web 服务集群', type: '流量诊断' },
  { id: 'BLOCK-DIAG-002', title: '策略误判分析', status: 'completed', createTime: '2026-06-01 14:30:00', target: 'API 网关', type: '策略分析' },
  { id: 'BLOCK-DIAG-003', title: '阻断原因定位', status: 'pending', createTime: '2026-06-02 10:00:00', target: '数据库服务', type: '原因定位' },
];

export function BlockDiagView() {
  const [tasks] = useState(mockTasks);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredTasks = tasks.filter(task => 
    !searchKeyword || task.title.includes(searchKeyword) || task.id.includes(searchKeyword)
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全阻断诊断视图</h2>
        <p className="text-sm text-gray-400 mt-1">诊断任务列表展示、过程展示、结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总任务</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待诊断</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">诊断中</p>
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
              placeholder="搜索任务标题或ID..."
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断目标</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">创建时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-4 text-sm text-blue-400">{task.id}</td>
                <td className="px-4 py-4 text-sm text-gray-300">{task.title}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{task.type}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-300">{task.target}</td>
                <td className="px-4 py-4">
                  {task.status === 'pending' && <span className="flex items-center gap-1 text-yellow-400 text-sm"><Clock className="w-4 h-4" />待诊断</span>}
                  {task.status === 'processing' && <span className="flex items-center gap-1 text-blue-400 text-sm"><Activity className="w-4 h-4 animate-pulse" />诊断中</span>}
                  {task.status === 'completed' && <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />已完成</span>}
                  {task.status === 'failed' && <span className="flex items-center gap-1 text-red-400 text-sm"><AlertTriangle className="w-4 h-4" />失败</span>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">{task.createTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
