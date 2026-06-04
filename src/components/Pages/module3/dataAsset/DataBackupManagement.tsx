'use client';

import { useState } from 'react';
import { HardDrive, Clock, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';

const mockHardDrives = [
  { id: 'backup-001', name: '每日备份', type: 'daily', schedule: '每天 02:00', status: 'success', lastRun: '2024-01-15 02:00:00', nextRun: '2024-01-16 02:00:00' },
  { id: 'backup-002', name: '每周备份', type: 'weekly', schedule: '每周日 01:00', status: 'success', lastRun: '2024-01-14 01:00:00', nextRun: '2024-01-21 01:00:00' },
  { id: 'backup-003', name: '每月备份', type: 'monthly', schedule: '每月1日 00:00', status: 'warning', lastRun: '2024-01-01 00:00:00', nextRun: '2024-02-01 00:00:00' },
  { id: 'backup-004', name: '实时备份', type: 'realtime', schedule: '实时', status: 'success', lastRun: '刚刚', nextRun: '-' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'success': return '成功';
    case 'warning': return '警告';
    case 'failed': return '失败';
    default: return '运行中';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-400';
    case 'warning': return 'text-yellow-400';
    case 'failed': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export function DataHardDriveManagement() {
  const [selectedHardDrive, setSelectedHardDrive] = useState(mockHardDrives[0]);

  const stats = {
    total: mockHardDrives.length,
    success: mockHardDrives.filter(b => b.status === 'success').length,
    warning: mockHardDrives.filter(b => b.status === 'warning').length,
    failed: mockHardDrives.filter(b => b.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">数据备份管理</h1>
          <p className="text-slate-400 mt-1">管理和监控数据备份任务</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <HardDrive className="w-3.5 h-3.5" />新建备份任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">备份任务</span>
            <HardDrive className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">成功</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.success}</div>
        </div>
        <div className="bg-[#20293F] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">警告</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.warning}</div>
        </div>
        <div className="bg-[#20293F] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">失败</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.failed}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {mockHardDrives.map(backup => (
            <div
              key={backup.id}
              className={`p-4 bg-[#20293F] border border-[#2A354D] rounded-lg cursor-pointer transition-all ${
                selectedHardDrive.id === backup.id ? 'ring-1 ring-blue-500/40' : 'hover:bg-[#111625]/50'
              }`}
              onClick={() => setSelectedHardDrive(backup)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{backup.name}</p>
                    <p className="text-slate-500 text-xs">{backup.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">上次执行</p>
                    <p className="text-slate-300 text-sm">{backup.lastRun}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(backup.status)}
                    <span className={`text-xs ${getStatusColor(backup.status)}`}>
                      {getStatusText(backup.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">备份详情</h3>
          {selectedHardDrive && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedHardDrive.name}</p>
                  <span className={`text-xs ${getStatusColor(selectedHardDrive.status)}`}>
                    {getStatusText(selectedHardDrive.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">备份类型</p>
                  <p className="text-slate-300">
                    {selectedHardDrive.type === 'daily' ? '每日备份' : 
                     selectedHardDrive.type === 'weekly' ? '每周备份' :
                     selectedHardDrive.type === 'monthly' ? '每月备份' : '实时备份'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">执行计划</p>
                  <p className="text-slate-300">{selectedHardDrive.schedule}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">上次执行</p>
                  <p className="text-slate-300">{selectedHardDrive.lastRun}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">下次执行</p>
                  <p className="text-slate-300">{selectedHardDrive.nextRun}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-1">
                  <Play className="w-3.5 h-3.5" />立即执行
                </button>
                <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md flex items-center justify-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />编辑计划
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}