'use client';

import React, { useState } from 'react';
import { Search, Clock, Database, Download, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  date: string;
  size: string;
  status: 'success' | 'failed';
}

export function DataRecovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  const mockBackups: Backup[] = [
    { id: 'B001', name: 'full-backup-20260604', type: 'full', date: '2026-06-04 03:00:00', size: '2.4 GB', status: 'success' },
    { id: 'B002', name: 'incr-backup-20260604-01', type: 'incremental', date: '2026-06-04 09:00:00', size: '156 MB', status: 'success' },
    { id: 'B003', name: 'incr-backup-20260604-02', type: 'incremental', date: '2026-06-04 15:00:00', size: '234 MB', status: 'success' },
    { id: 'B004', name: 'diff-backup-20260604', type: 'differential', date: '2026-06-04 18:00:00', size: '890 MB', status: 'success' },
    { id: 'B005', name: 'full-backup-20260603', type: 'full', date: '2026-06-03 03:00:00', size: '2.3 GB', status: 'success' },
    { id: 'B006', name: 'full-backup-20260602', type: 'full', date: '2026-06-02 03:00:00', size: '2.1 GB', status: 'failed' },
  ];

  const filteredBackups = mockBackups.filter(backup => 
    backup.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-blue-500/20 text-blue-400';
      case 'incremental': return 'bg-green-500/20 text-green-400';
      case 'differential': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'full': return '全量备份';
      case 'incremental': return '增量备份';
      case 'differential': return '差异备份';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">数据恢复</h2>
          <p className="text-sm text-gray-400 mt-1">从备份文件恢复数据</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索备份名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">备份列表</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredBackups.map(backup => (
              <div
                key={backup.id}
                onClick={() => setSelectedBackup(backup)}
                className={`flex items-center justify-between px-4 py-3 border-t border-[#2A354D] cursor-pointer ${selectedBackup?.id === backup.id ? 'bg-[#111625]' : 'hover:bg-[#111625]'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{backup.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(backup.type)}`}>
                      {getTypeName(backup.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {backup.date}
                    <span className="mx-1">|</span>
                    {backup.size}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {backup.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111625] flex items-center gap-2">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">恢复选项</span>
          </div>
          <div className="p-4">
            {selectedBackup ? (
              <div className="space-y-4">
                <div className="bg-[#111625] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">{selectedBackup.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">备份类型</span>
                      <div className={`mt-1 px-2 py-1 rounded text-xs ${getTypeColor(selectedBackup.type)}`}>
                        {getTypeName(selectedBackup.type)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">备份时间</span>
                      <div className="mt-1 text-white">{selectedBackup.date}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">备份大小</span>
                      <div className="mt-1 text-white">{selectedBackup.size}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">备份状态</span>
                      <div className={`mt-1 flex items-center gap-1 ${selectedBackup.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedBackup.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {selectedBackup.status === 'success' ? '成功' : '失败'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111625] rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-3">恢复范围</div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="recoveryScope" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-300">全部数据</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="recoveryScope" className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-300">仅用户数据</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="recoveryScope" className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-300">仅配置数据</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-[#2A354D] hover:bg-[#354158] text-gray-300 rounded text-sm">取消</button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">开始恢复</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Database className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">请选择一个备份文件</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataRecovery;