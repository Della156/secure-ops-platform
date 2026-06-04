'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, User, Eye, X, Filter, Calendar } from 'lucide-react';
import type { ResourceType, AccessLogItem } from '@/data/module1/resourceMock';
import { getResourceMock, resourceConfig } from '@/data/module1/resourceMock';

interface ResourceAccessLogProps {
  resourceType: ResourceType;
}

export function ResourceAccessLog({ resourceType }: ResourceAccessLogProps) {
  const config = resourceConfig[resourceType];
  const mock = getResourceMock(resourceType);
  
  const [logs, setLogs] = useState<AccessLogItem[]>(mock.accessLogs);
  const [searchText, setSearchText] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [filterTimeRange, setFilterTimeRange] = useState('');
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AccessLogItem | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.resourceName.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.operator.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.operation.toLowerCase().includes(searchText.toLowerCase());
    const matchOperator = !filterOperator || log.operator === filterOperator;
    const matchOperation = !filterOperation || log.operation === filterOperation;
    const matchResult = !filterResult || log.result === filterResult;
    return matchSearch && matchOperator && matchOperation && matchResult;
  });

  const operators = [...new Set(logs.map(l => l.operator))];
  const operations = [...new Set(logs.map(l => l.operation))];

  const getResultBadge = (result: string) => {
    const styles = {
      success: 'bg-[#00C853]/20 text-[#00C853]',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30]',
    };
    const labels = {
      success: '成功',
      failed: '失败',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[result as keyof typeof styles]}`}>
        {labels[result as keyof typeof labels]}
      </span>
    );
  };

  const handleExport = () => {
    const data = logs.map(log => ({
      'ID': log.id,
      '资源名称': log.resourceName,
      '操作人': log.operator,
      '操作类型': log.operation,
      '结果': log.result === 'success' ? '成功' : '失败',
      '时间': log.timestamp,
      'IP地址': log.ip,
      '详情': log.details,
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.label}访问日志.csv`;
    link.click();
  };

  const handleOpenDetail = (log: AccessLogItem) => {
    setSelectedLog(log);
    setShowDetailDrawer(true);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffMs = now.getTime() - logTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`;
    return `${Math.floor(diffMins / 1440)}天前`;
  };

  const statusCounts = {
    total: logs.length,
    success: logs.filter(l => l.result === 'success').length,
    failed: logs.filter(l => l.result === 'failed').length,
  };

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">{config.title}访问日志</h1>
          <p className="text-[#9CA3AF]">查看{config.label}的访问记录和操作日志</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0066FF]/20 rounded-lg">
                <Clock className="w-5 h-5 text-[#0066FF]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">总日志数</p>
                <p className="text-2xl font-bold text-[#F3F4F6]">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00C853]/20 rounded-lg">
                <Eye className="w-5 h-5 text-[#00C853]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">成功操作</p>
                <p className="text-2xl font-bold text-[#00C853]">{statusCounts.success}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF3B30]/20 rounded-lg">
                <Filter className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm">失败操作</p>
                <p className="text-2xl font-bold text-[#FF3B30]">{statusCounts.failed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="搜索资源名称/操作人/操作..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
                />
              </div>

              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部操作人</option>
                {operators.map(operator => (
                  <option key={operator} value={operator}>{operator}</option>
                ))}
              </select>

              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部操作</option>
                {operations.map(operation => (
                  <option key={operation} value={operation}>{operation}</option>
                ))}
              </select>

              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="">全部结果</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
              </select>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <select
                  value={filterTimeRange}
                  onChange={(e) => setFilterTimeRange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="">全部时间</option>
                  <option value="1h">最近1小时</option>
                  <option value="24h">最近24小时</option>
                  <option value="7d">最近7天</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出日志
            </button>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#181F32]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{config.label}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">结果</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#181F32]/30 transition-colors cursor-pointer" onClick={() => handleOpenDetail(log)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{log.resourceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                      <span className="text-sm text-[#D1D5DB]">{log.operator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{log.operation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getResultBadge(log.result)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#9CA3AF]" />
                      <div>
                        <p className="text-sm text-[#D1D5DB]">{log.timestamp}</p>
                        <p className="text-xs text-[#6B7280]">{getTimeAgo(log.timestamp)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB] font-mono">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenDetail(log); }}
                      className="text-[#0066FF] hover:text-[#4D94FF] text-sm"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[#6B7280]">暂无日志记录</p>
            </div>
          )}
        </div>
      </div>

      {showDetailDrawer && selectedLog && (
        <div className="w-96 bg-[#20293F] border-l border-[#2A354D] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">日志详情</h3>
            <button
              onClick={() => setShowDetailDrawer(false)}
              className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">日志ID</label>
              <p className="text-[#F3F4F6]">{selectedLog.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">{config.label}</label>
              <p className="text-[#F3F4F6]">{selectedLog.resourceName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">操作人</label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#F3F4F6]">{selectedLog.operator}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">操作类型</label>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF]">
                {selectedLog.operation}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">操作结果</label>
              {getResultBadge(selectedLog.result)}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">操作时间</label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#F3F4F6]">{selectedLog.timestamp}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">来源IP</label>
              <p className="text-[#F3F4F6] font-mono">{selectedLog.ip}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">操作详情</label>
              <p className="text-[#F3F4F6]">{selectedLog.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}