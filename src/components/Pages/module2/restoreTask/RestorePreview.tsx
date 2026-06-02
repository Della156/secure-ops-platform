'use client';

import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, Database, FileText } from 'lucide-react';

interface BackupItem {
  id: string;
  name: string;
  target: string;
  backupTime: string;
  size: string;
  type: string;
}

const mockBackups: BackupItem[] = [
  { id: 'BK-001', name: 'prod-db_20260602', target: 'prod-db', backupTime: '2026-06-02 02:00:00', size: '2.5 GB', type: '全量备份' },
  { id: 'BK-002', name: 'prod-db_20260601', target: 'prod-db', backupTime: '2026-06-01 02:00:00', size: '2.4 GB', type: '全量备份' },
  { id: 'BK-003', name: 'prod-db_20260531', target: 'prod-db', backupTime: '2026-05-31 02:00:00', size: '2.3 GB', type: '全量备份' },
];

interface PreviewData {
  tableName: string;
  rowCount: number;
  lastModified: string;
}

const mockPreviewData: PreviewData[] = [
  { tableName: 'users', rowCount: 10000, lastModified: '2026-06-02 01:50:00' },
  { tableName: 'orders', rowCount: 50000, lastModified: '2026-06-02 01:45:00' },
  { tableName: 'products', rowCount: 2000, lastModified: '2026-06-02 01:30:00' },
  { tableName: 'logs', rowCount: 100000, lastModified: '2026-06-02 01:25:00' },
];

export function RestorePreview() {
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredBackups = mockBackups.filter(item =>
    !searchKeyword || 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">恢复数据预览</h2>
        <p className="text-sm text-gray-400 mt-1">在恢复前对备份数据进行预览，确认恢复点，预览数据展示</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">备份列表</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索备份..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10 pr-4 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {filteredBackups.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedBackup(item)}
                className={`p-4 cursor-pointer hover:bg-[#2A354D]/50 transition-colors ${selectedBackup?.id === item.id ? 'bg-[#2A354D]/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>{item.target}</span>
                      <span>{item.backupTime}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  <Eye className={`w-4 h-4 transition-transform ${selectedBackup?.id === item.id ? 'text-blue-400' : 'text-gray-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">备份数据预览</h3>
          </div>
          <div className="p-4">
            {selectedBackup ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{selectedBackup.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">备份目标</p>
                    <p className="text-sm text-gray-300">{selectedBackup.target}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">备份时间</p>
                    <p className="text-sm text-gray-300">{selectedBackup.backupTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">备份大小</p>
                    <p className="text-sm text-gray-300">{selectedBackup.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">备份类型</p>
                    <p className="text-sm text-gray-300">{selectedBackup.type}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A354D]">
                  <p className="text-xs text-gray-500 mb-3">包含的数据表</p>
                  <div className="space-y-2">
                    {mockPreviewData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#111827] rounded-lg p-3">
                        <div>
                          <span className="text-sm text-white">{item.tableName}</span>
                          <p className="text-xs text-gray-500 mt-1">最后修改: {item.lastModified}</p>
                        </div>
                        <span className="text-sm text-gray-400">{item.rowCount.toLocaleString()} 行</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A354D]">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    确认恢复此备份
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Eye className="w-12 h-12 mb-4 opacity-50" />
                <p>请选择备份查看预览</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}