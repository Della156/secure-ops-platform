'use client';

import React, { useState } from 'react';
import { Search, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ParameterItem {
  id: string;
  database: string;
  parameter: string;
  currentValue: string;
  recommendedValue: string;
  status: 'compliant' | 'non-compliant';
  category: string;
  description: string;
}

const mockData: ParameterItem[] = [
  { id: 'PARAM-001', database: 'MySQL-Prod', parameter: 'max_connections', currentValue: '500', recommendedValue: '1000', status: 'non-compliant', category: '性能', description: '最大连接数设置' },
  { id: 'PARAM-002', database: 'MySQL-Prod', parameter: 'sql_mode', currentValue: 'STRICT_TRANS_TABLES', recommendedValue: 'STRICT_TRANS_TABLES', status: 'compliant', category: '安全', description: 'SQL模式设置' },
  { id: 'PARAM-003', database: 'MySQL-Prod', parameter: 'innodb_flush_log_at_trx_commit', currentValue: '1', recommendedValue: '1', status: 'compliant', category: '可靠性', description: '事务提交时刷新日志' },
  { id: 'PARAM-004', database: 'PostgreSQL-Prod', parameter: 'max_connections', currentValue: '200', recommendedValue: '200', status: 'compliant', category: '性能', description: '最大连接数设置' },
  { id: 'PARAM-005', database: 'PostgreSQL-Prod', parameter: 'log_statement', currentValue: 'none', recommendedValue: 'all', status: 'non-compliant', category: '安全', description: '日志记录级别' },
  { id: 'PARAM-006', database: 'Oracle-Dev', parameter: 'audit_trail', currentValue: 'NONE', recommendedValue: 'DB,EXTENDED', status: 'non-compliant', category: '安全', description: '审计跟踪设置' },
];

export function ParameterSecurityCheck() {
  const [data] = useState<ParameterItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.parameter.toLowerCase().includes(searchKeyword.toLowerCase()) || d.database.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    compliant: data.filter(d => d.status === 'compliant').length,
    nonCompliant: data.filter(d => d.status === 'non-compliant').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'compliant') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">合规</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">不合规</span>;
  };

  const getCategoryBadge = (category: string) => {
    if (category === '安全') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">{category}</span>;
    if (category === '性能') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{category}</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">{category}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据库参数安全配置检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查数据库参数的安全配置是否符合最佳实践</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">参数总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">合规</p>
              <p className="text-xl font-semibold text-green-400">{stats.compliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不合规</p>
              <p className="text-xl font-semibold text-red-400">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据库</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">参数名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前值</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">建议值</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.database}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{item.parameter}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono ${item.status === 'compliant' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.currentValue}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-400 font-mono">{item.recommendedValue}</td>
                  <td className="px-4 py-3">{getCategoryBadge(item.category)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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