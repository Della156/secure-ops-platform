'use client';

import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, Play, FileText } from 'lucide-react';

interface ProcessStep {
  id: string;
  stepName: string;
  executeTime: string;
  result: 'success' | 'failed';
  output: string;
}

interface DrillRecord {
  id: string;
  drillName: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'running' | 'failed';
  steps: ProcessStep[];
}

const mockRecords: DrillRecord[] = [
  {
    id: 'DRILL-001',
    drillName: '安全演练-20260602',
    startTime: '2026-06-02 09:00:00',
    endTime: '2026-06-02 09:30:00',
    status: 'completed',
    steps: [
      { id: 'S-001', stepName: '初始化环境', executeTime: '09:00:05', result: 'success', output: '环境初始化完成' },
      { id: 'S-002', stepName: '执行检测脚本', executeTime: '09:05:00', result: 'success', output: '检测完成，发现3个问题' },
      { id: 'S-003', stepName: '执行修复操作', executeTime: '09:15:00', result: 'success', output: '修复完成' },
      { id: 'S-004', stepName: '验证修复结果', executeTime: '09:25:00', result: 'success', output: '验证通过' },
    ],
  },
  {
    id: 'DRILL-002',
    drillName: '备份恢复演练',
    startTime: '2026-06-01 14:00:00',
    endTime: '2026-06-01 14:45:00',
    status: 'failed',
    steps: [
      { id: 'S-001', stepName: '停止服务', executeTime: '14:00:05', result: 'success', output: '服务已停止' },
      { id: 'S-002', stepName: '执行恢复', executeTime: '14:05:00', result: 'failed', output: '恢复失败：网络超时' },
    ],
  },
];

export function DrillProcessRecord() {
  const [records] = useState(mockRecords);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DrillRecord | null>(null);

  const filteredRecords = records.filter(r => 
    !searchKeyword || r.drillName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">进行中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">失败</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">演练过程记录</h2>
        <p className="text-sm text-gray-400 mt-1">演练全过程的详细记录（每一步执行时间、结果、输出），演练日志查询</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索演练名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
              />
            </div>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {filteredRecords.map((record) => (
              <div 
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`p-4 cursor-pointer hover:bg-[#2A354D]/50 transition-colors ${selectedRecord?.id === record.id ? 'bg-[#2A354D]/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{record.drillName}</span>
                  {getStatusBadge(record.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{record.startTime} - {record.endTime}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{record.steps.length} 个步骤</span>
                  <span className={record.status === 'completed' ? 'text-green-400' : 'text-red-400'}>
                    {record.steps.filter(s => s.result === 'success').length}/{record.steps.length} 通过
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            {selectedRecord ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{selectedRecord.drillName}</span>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>开始时间: {selectedRecord.startTime}</span>
                  <span>结束时间: {selectedRecord.endTime}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <FileText className="w-10 h-10 mb-2 opacity-50" />
                <p>请选择演练记录查看详情</p>
              </div>
            )}
          </div>
          <div className="p-4">
            {selectedRecord && (
              <div className="space-y-3">
                {selectedRecord.steps.map((step, index) => (
                  <div key={step.id} className="bg-[#111827] rounded-lg p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.result === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {step.result === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">步骤 {index + 1}: {step.stepName}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {step.executeTime}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${step.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {step.result === 'success' ? '成功' : '失败'}
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-[#1E2736] rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">输出结果</p>
                      <p className="text-sm text-gray-300 font-mono">{step.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}