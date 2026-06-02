'use client';

import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Network, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  type: string;
  cpuUsage: number;
  memoryUsage: number;
  status: 'normal' | 'warning' | 'critical';
  faults: string[];
  suggestions: string[];
}

const mockDevices: DeviceItem[] = [
  { 
    id: 'SW-01', 
    name: '核心交换机', 
    type: '交换机',
    cpuUsage: 85, 
    memoryUsage: 72, 
    status: 'warning',
    faults: ['CPU使用率过高', '接口流量异常'],
    suggestions: ['检查流量峰值时段', '考虑扩容或分流']
  },
  { 
    id: 'FW-01', 
    name: '防火墙', 
    type: '防火墙',
    cpuUsage: 45, 
    memoryUsage: 55, 
    status: 'normal',
    faults: [],
    suggestions: ['运行正常，建议定期检查']
  },
];

export function DeviceFaultAnalysis() {
  const [devices] = useState(mockDevices);

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'border-red-500/50 bg-red-500/10';
    if (status === 'warning') return 'border-yellow-500/50 bg-yellow-500/10';
    return 'border-green-500/50 bg-green-500/10';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">网络设备故障分析</h2>
        <p className="text-sm text-gray-400 mt-1">自动分析设备CPU/内存、接口状态、设备故障定位，故障根因建议</p>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className={`bg-[#1E2736] border rounded-lg p-4 ${getStatusColor(device.status)}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{device.name}</span>
                  <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400">{device.type}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Cpu className="w-4 h-4" />
                      CPU使用率
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#111827] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${device.cpuUsage > 80 ? 'bg-red-500' : device.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${device.cpuUsage}%` }} 
                        />
                      </div>
                      <span className={`text-sm font-medium ${device.cpuUsage > 80 ? 'text-red-400' : device.cpuUsage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {device.cpuUsage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <HardDrive className="w-4 h-4" />
                      内存使用率
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#111827] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${device.memoryUsage > 80 ? 'bg-red-500' : device.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${device.memoryUsage}%` }} 
                        />
                      </div>
                      <span className={`text-sm font-medium ${device.memoryUsage > 80 ? 'text-red-400' : device.memoryUsage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {device.memoryUsage}%
                      </span>
                    </div>
                  </div>
                </div>

                {device.faults.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs text-red-400 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      检测到故障
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {device.faults.map((fault, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400">{fault}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1 text-xs text-blue-400 mb-1">
                    <Lightbulb className="w-4 h-4" />
                    建议
                  </div>
                  <ul className="space-y-1">
                    {device.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}