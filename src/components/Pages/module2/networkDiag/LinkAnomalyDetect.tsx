'use client';

import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Plus, Edit2, Trash2, Wifi, Clock, Zap } from 'lucide-react';

interface LinkItem {
  id: string;
  name: string;
  source: string;
  destination: string;
  packetLoss: number;
  latency: number;
  jitter: number;
  status: 'normal' | 'warning' | 'critical';
  quality: number;
}

const mockLinks: LinkItem[] = [
  { id: 'LINK-001', name: '主链路A', source: '北京', destination: '上海', packetLoss: 0.5, latency: 25, jitter: 5, status: 'normal', quality: 95 },
  { id: 'LINK-002', name: '备份链路B', source: '北京', destination: '广州', packetLoss: 3.2, latency: 45, jitter: 12, status: 'warning', quality: 82 },
  { id: 'LINK-003', name: '跨区链路C', source: '上海', destination: '深圳', packetLoss: 8.5, latency: 65, jitter: 25, status: 'critical', quality: 65 },
];

export function LinkAnomalyDetect() {
  const [links] = useState(mockLinks);

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (status === 'warning') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getStatusText = (status: string) => {
    if (status === 'critical') return '严重';
    if (status === 'warning') return '警告';
    return '正常';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">网络链路异常检测</h2>
        <p className="text-sm text-gray-400 mt-1">自动检测链路丢包率、延迟、抖动，异常链路识别，链路质量评估</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">检测策略管理</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增策略
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div key={link.id} className={`bg-[#1E2736] border rounded-lg p-4 ${getStatusColor(link.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                <span className="text-white font-medium">{link.name}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded ${
                link.status === 'critical' ? 'bg-red-500/30 text-red-400' :
                link.status === 'warning' ? 'bg-yellow-500/30 text-yellow-400' :
                'bg-green-500/30 text-green-400'
              }`}>
                {getStatusText(link.status)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>{link.source} → {link.destination}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm mb-3">
              <div className="bg-[#111827] rounded p-2">
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  丢包率
                </div>
                <p className={`font-medium ${link.packetLoss > 5 ? 'text-red-400' : link.packetLoss > 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {link.packetLoss}%
                </p>
              </div>
              <div className="bg-[#111827] rounded p-2">
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  延迟
                </div>
                <p className={`font-medium ${link.latency > 50 ? 'text-red-400' : link.latency > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {link.latency}ms
                </p>
              </div>
              <div className="bg-[#111827] rounded p-2">
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                  <Zap className="w-3 h-3" />
                  抖动
                </div>
                <p className={`font-medium ${link.jitter > 20 ? 'text-red-400' : link.jitter > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {link.jitter}ms
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">链路质量</span>
                <span className={link.quality > 80 ? 'text-green-400' : link.quality > 60 ? 'text-yellow-400' : 'text-red-400'}>
                  {link.quality}%
                </span>
              </div>
              <div className="w-full bg-[#111827] rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${link.quality > 80 ? 'bg-green-500' : link.quality > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${link.quality}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}