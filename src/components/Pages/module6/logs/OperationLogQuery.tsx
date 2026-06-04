'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Edit3, Trash2, Settings, FileText } from 'lucide-react';

interface OperationLog {
  id: string;
  username: string;
  operation: string;
  module: string;
  target: string;
  time: string;
  ip: string;
  result: 'success' | 'failed';
}

export function OperationLogQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  const mockData: OperationLog[] = [
    { id: 'OP-001', username: 'admin', operation: '新增', module: '同步任务配置', target: '用户数据同步', time: '2026-06-04 10:35:23', ip: '192.168.1.100', result: 'success' },
    { id: 'OP-002', username: 'user01', operation: '修改', module: '角色权限配置', target: '管理员角色', time: '2026-06-04 10:34:15', ip: '192.168.1.101', result: 'success' },
    { id: 'OP-003', username: 'admin', operation: '删除', module: '数据字典', target: '状态码字典', time: '2026-06-04 10:33:45', ip: '192.168.1.100', result: 'success' },
    { id: 'OP-004', username: 'user02', operation: '查询', module: '日志查询', target: '登录日志', time: '2026-06-04 10:32:12', ip: '192.168.1.102', result: 'success' },
    { id: 'OP-005', username: 'user03', operation: '导出', module: '报表中心', target: '安全日报', time: '2026-06-04 10:31:56', ip: '192.168.1.103', result: 'success' },
    { id: 'OP-006', username: 'admin', operation: '修改', module: '运行参数', target: '全局参数', time: '2026-06-04 10:30:34', ip: '192.168.1.100', result: 'failed' },
    { id: 'OP-007', username: 'user04', operation: '新增', module: 'API配置', target: '告警推送API', time: '2026-06-04 10:29:18', ip: '192.168.1.105', result: 'success' },
    { id: 'OP-008', username: 'admin', operation: '审核', module: '权限申请', target: 'user05的权限申请', time: '2026-06-04 10:28:45', ip: '192.168.1.100', result: 'success' },
  ];

  const modules = ['all', '同步任务配置', '角色权限配置', '数据字典', '日志查询', '报表中心', '运行参数', 'API配置', '权限申请'];

  const filteredData = mockData.filter(item => 
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterModule === 'all' || item.module === filterModule)
  );

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case '新增': return <Edit3 className="w-4 h-4" />;
      case '修改': return <Settings className="w-4 h-4" />;
      case '删除': return <Trash2 className="w-4 h-4" />;
      case '查询':
      case '导出': return <FileText className="w-4 h-4" />;
      default: return <Edit3 className="w-4 h-4" />;
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case '新增': return 'bg-green-500/20 text-green-400';
      case '修改': return 'bg-blue-500/20 text-blue-400';
      case '删除': return 'bg-red-500/20 text-red-400';
      case '查询': return 'bg-gray-500/20 text-gray-400';
      case '导出': return 'bg-purple-500/20 text-purple-400';
      case '审核': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">用户日志查询</h2>
          <p className="text-sm text-gray-400 mt-1">查询用户操作记录，追踪系统操作行为</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20293F] border border-[#2A354D] text-gray-300 rounded text-sm hover:bg-[#2A354D]">
          <Download className="w-4 h-4" />
          导出日志
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索操作目标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {modules.map(module => (
                <option key={module} value={module}>{module === 'all' ? '全部模块' : module}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作用户</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">模块</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作目标</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">结果</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">{item.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getOperationColor(item.operation)}`}>
                    {getOperationIcon(item.operation)}
                    {item.operation}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.module}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.target}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.time}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.ip}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.result === 'success' ? '成功' : '失败'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredData.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationLogQuery;