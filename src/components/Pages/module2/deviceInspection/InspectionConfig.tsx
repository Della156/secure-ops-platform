'use client';

import React, { useState } from 'react';
import { Save, Server, Settings, CheckCircle } from 'lucide-react';

export function InspectionConfig() {
  const [inspectionName, setInspectionName] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [checkItems, setCheckItems] = useState({
    cpu: true,
    memory: true,
    disk: true,
    network: true,
    service: false,
    log: false,
  });

  const groups = [
    { value: 'all', label: '全部设备' },
    { value: 'network', label: '网络设备组' },
    { value: 'server', label: '服务器组' },
    { value: 'security', label: '安全设备组' },
    { value: 'custom', label: '自定义选择' },
  ];

  const toggleCheckItem = (key: keyof typeof checkItems) => {
    setCheckItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">巡检配置</h2>
        <p className="text-sm text-gray-400 mt-1">巡检设备选择、巡检项配置、巡检频率设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">基本信息</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">巡检任务名称</label>
              <input
                type="text"
                value={inspectionName}
                onChange={(e) => setInspectionName(e.target.value)}
                placeholder="输入巡检任务名称"
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">巡检目标</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {groups.map(group => (
                  <option key={group.value} value={group.value}>{group.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-300">巡检项配置</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'cpu', label: 'CPU使用率检查' },
              { key: 'memory', label: '内存使用率检查' },
              { key: 'disk', label: '磁盘空间检查' },
              { key: 'network', label: '网络连通性检查' },
              { key: 'service', label: '服务状态检查' },
              { key: 'log', label: '日志异常检查' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
                <span className="text-sm text-gray-300">{item.label}</span>
                <button
                  onClick={() => toggleCheckItem(item.key as keyof typeof checkItems)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    checkItems[item.key as keyof typeof checkItems] 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#2A354D] text-gray-500'
                  }`}
                >
                  {checkItems[item.key as keyof typeof checkItems] && <CheckCircle className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-6 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
          取消
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>
    </div>
  );
}