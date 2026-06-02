'use client';

import React, { useState } from 'react';
import { RefreshCw, Clock, CheckCircle, AlertTriangle, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

interface SyncConfig {
  id: string;
  name: string;
  syncType: string;
  schedule: string;
  lastSync: string;
  status: 'success' | 'failed';
}

const mockConfigs: SyncConfig[] = [
  { id: 'SYNC-001', name: 'CMDB网段同步', syncType: '网段数据', schedule: '每小时', lastSync: '2026-06-02 10:00:00', status: 'success' },
  { id: 'SYNC-002', name: '网络管理系统同步', syncType: '区域信息', schedule: '每天', lastSync: '2026-06-01 23:00:00', status: 'success' },
];

export function NetSegDataSync() {
  const [configs] = useState(mockConfigs);

  const handleSync = (id: string) => {
    console.log('Syncing:', id);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙网段数据同步</h2>
        <p className="text-sm text-gray-400 mt-1">与CMDB/网络管理系统同步防火墙网段、区域信息，同步任务调度，同步状态监控</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">同步策略列表</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增策略
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{config.name}</span>
                  {config.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {config.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">同步类型</p>
                    <p className="text-gray-300">{config.syncType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">调度周期</p>
                    <p className="text-gray-300">{config.schedule}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">上次同步</p>
                    <p className="text-gray-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {config.lastSync}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSync(config.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  同步
                </button>
                <button className="p-2 bg-[#2A354D] hover:bg-[#3D4A61] rounded-lg text-gray-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}