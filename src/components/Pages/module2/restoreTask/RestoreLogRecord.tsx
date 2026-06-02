'use client';

import React, { useState } from 'react';
import { Search, Calendar, User, FileText, Download, Clock } from 'lucide-react';

interface LogItem {
  id: string;
  taskName: string;
  content: string;
  operator: string;
  operateTime: string;
  result: 'success' | 'failed';
}

const mockData: LogItem[] = [
  { id: 'LG-001', taskName: '数据库恢复', content: '开始恢复数据库 prod-db，备份文件: prod-db_20260602', operator: 'admin', operateTime: '2026-06-02 10:00:00', result: 'success' },
  { id: 'LG-002', taskName: '数据库恢复', content: '正在恢复表 users...', operator: 'admin', operateTime: '2026-06-02 10:05:00', result: 'success' },
  { id: 'LG-003', taskName: '数据库恢复', content: '正在恢复表 orders...', operator: 'admin', operateTime: '2026-06-02 10:15:00', result: 'success' },
  { id: 'LG-004', taskName: '数据库恢复', content: '数据库恢复完成，共恢复 4 张表，162000 条记录', operator: 'admin', operateTime: '2026-06-02 10:30:00', result: 'success' },
  { id: 'LG-005', taskName: '用户数据恢复', content: '开始恢复用户数据，备份文件: user-db_20260601', operator: 'admin', operateTime: '2026-06-02 09:00:00', result: 'failed' },
  { id: 'LG-006', taskName: '用户数据恢复', content: '备份文件校验失败，文件已损坏', operator: 'admin', operateTime: '2026-06-02 09:10:00', result: 'failed' },
];

export function RestoreLogRecord() {
  const [data] = useState<LogItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.operator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">恢复日志记录</h2>
        <p className="text-sm text-gray-400 mt-1">恢复操作的详细日志记录（恢复内容、时间、操作人、结果），日志查询与导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务名称、内容或操作人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              筛选日期
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出日志
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-3">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-2">
                <FileText className={`w-4 h-4 ${item.result === 'success' ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-sm font-medium text-white">{item.taskName}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${item.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.result === 'success' ? '成功' : '失败'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">{item.content}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.operator}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.operateTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}