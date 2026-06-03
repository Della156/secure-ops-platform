'use client';

import React, { useState } from 'react';
import { Settings, GitDiff, FileCheck, Download, Plus, Minus, Eye, Calendar } from 'lucide-react';

interface DiffItem {
  id: string;
  target: string;
  configType: string;
  collectTimeBefore: string;
  collectTimeAfter: string;
  diffCount: number;
  status: 'normal' | 'warning' | 'critical';
}

const mockDiffData: DiffItem[] = [
  { id: 'DIFF-001', target: 'core-switch-01', configType: '网络配置', collectTimeBefore: '2026-06-02 08:00:00', collectTimeAfter: '2026-06-02 09:00:00', diffCount: 3, status: 'warning' },
  { id: 'DIFF-002', target: 'prod-db-01', configType: '数据库参数', collectTimeBefore: '2026-06-02 07:30:00', collectTimeAfter: '2026-06-02 08:30:00', diffCount: 1, status: 'normal' },
  { id: 'DIFF-003', target: 'web-server-01', configType: '系统配置', collectTimeBefore: '2026-06-02 08:15:00', collectTimeAfter: '2026-06-02 09:15:00', diffCount: 8, status: 'critical' },
];

const configDiffExample = [
  { line: 1, type: 'same', content: 'hostname web-server-01' },
  { line: 2, type: 'same', content: 'interface eth0' },
  { line: 3, type: 'removed', content: '  ip address 192.168.1.100/24' },
  { line: 4, type: 'added', content: '  ip address 192.168.1.101/24' },
  { line: 5, type: 'same', content: '  no shutdown' },
  { line: 6, type: 'same', content: '!' },
  { line: 7, type: 'removed', content: 'route 0.0.0.0/0 192.168.1.1' },
  { line: 8, type: 'added', content: 'route 0.0.0.0/0 192.168.1.254' },
];

export function ConfigDiffCompare() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const getStatusBadge = (status: string) => {
    if (status === 'critical') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (status === 'warning') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">警告</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">正常</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业前后配置比对</h2>
        <p className="text-sm text-gray-400 mt-1">配置采集、差异比对、差异报告生成</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              配置采集与比对任务
            </h3>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {mockDiffData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-[#253042] cursor-pointer transition-colors" onClick={() => { setSelectedTarget(item.target); setShowDiff(true); }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <GitDiff className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.target}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{item.configType}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-yellow-400">{item.diffCount} 处差异</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <div>作业前: {item.collectTimeBefore}</div>
                        <div>作业后: {item.collectTimeAfter}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); }}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDiff ? (
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
            <div className="p-4 border-b border-[#2A354D] flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <GitDiff className="w-4 h-4" />
                配置差异详情 - {selectedTarget}
              </h3>
              <button onClick={() => setShowDiff(false)} className="text-gray-400 hover:text-white text-xs">
                关闭
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/20 rounded" />
                  <span className="text-green-400">新增</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500/20 rounded" />
                  <span className="text-red-400">删除</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-600 rounded" />
                  <span className="text-gray-400">未变更</span>
                </div>
              </div>
              <div className="bg-[#111827] rounded-lg p-4 font-mono text-xs overflow-x-auto">
                {configDiffExample.map((line, idx) => (
                  <div key={idx} className={`flex items-center gap-2 py-0.5 ${
                    line.type === 'added' ? 'bg-green-500/10 text-green-400' :
                    line.type === 'removed' ? 'bg-red-500/10 text-red-400' :
                    'text-gray-400'
                  }`}>
                    <span className="w-8 text-gray-600">{line.line}</span>
                    <span className="w-4">
                      {line.type === 'added' ? <Plus className="w-3 h-3" /> :
                       line.type === 'removed' ? <Minus className="w-3 h-3" /> : ' '}
                    </span>
                    <span>{line.content}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  导出差异报告
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
            <FileCheck className="w-12 h-12 mb-4 opacity-50" />
            <p>选择左侧任务查看配置差异</p>
          </div>
        )}
      </div>
    </div>
  );
}
